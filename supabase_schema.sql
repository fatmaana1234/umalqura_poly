-- ====================================================================
-- Um Alqura Polyclinic Complete System 2026
-- Supabase (PostgreSQL 15) Production Database Schema & Security Rules
-- Specialty: Physiotherapy & Rehabilitation ONLY
-- Location: Barka, Sultanate of Oman
-- Contact: +968 79470050 / +968 94545025
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STAFF & CULTURAL COMPLIANCE
CREATE TABLE public.staff (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('admin', 'physiotherapist', 'receptionist', 'assistant')) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    cultural_dress VARCHAR(150),
    phone VARCHAR(30),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Staff (Dr. Saba, Receptionist, Assistant)
INSERT INTO public.staff (id, name, role, gender, cultural_dress, phone) VALUES
('staff-saba', 'د. سبأ', 'physiotherapist', 'female', 'عباءة محتشمة إسلامية وفق التقاليد العمانية والخليجية', '+96879470050'),
('staff-reception', 'موظفة الاستقبال والتنسيق', 'receptionist', 'female', 'عباءة محتشمة', '+96879470050'),
('staff-assistant', 'المساعدة الطبية', 'assistant', 'female', 'زي طبي رسمي ساتر ومحتشم', '+96879470050')
ON CONFLICT (id) DO NOTHING;

-- 2. MEDICAL BEDS & TREATMENT BAYS
CREATE TABLE public.medical_beds (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    room VARCHAR(100) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    assigned_gender VARCHAR(10) CHECK (assigned_gender IN ('male', 'female', 'any')) DEFAULT 'any'
);

INSERT INTO public.medical_beds (id, name, room, assigned_gender) VALUES
('bed-1', 'السرير الطبي 1 - جناح الرعاية الخاصة (أزرق)', 'غرفة العلاج الرئيسي Bay 1', 'female'),
('bed-2', 'السرير الطبي 2 - سرير شد الفقرات المحوسب', 'وحدة شد الفقرات Traction Bay', 'any'),
('bed-3', 'السرير الطبي 3 - جناح الموجات التصادمية', 'غرفة الموجات التصادمية Shockwave Bay', 'any'),
('bed-4', 'السرير الطبي 4 - جناح التأهيل للرجال', 'غرفة العلاج الرجالي Bay 2', 'male'),
('bed-gym', 'منطقة تمارين الصالة التأهيلية Gym Bay', 'صالة التأهيل الطبي والتمارين الحركية', 'any')
ON CONFLICT (id) DO NOTHING;

-- 3. MEDICAL DEVICES (BTL 4000, Shockwave, Traction, Air Compression, Gym)
CREATE TABLE public.medical_devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    model VARCHAR(100) NOT NULL,
    device_type VARCHAR(60) NOT NULL,
    room VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('available', 'in_use', 'maintenance')) DEFAULT 'available',
    safety_limit_minutes INT DEFAULT 30
);

INSERT INTO public.medical_devices (id, name, model, device_type, room) VALUES
('dev-traction', 'جهاز شد الفقرات العنقية والقطنية المحوسب', 'Computerized Spinal Decompression', 'cervical_lumbar_traction', 'غرفة شد الفقرات'),
('dev-shockwave', 'جهاز الموجات التصادمية BTL الحديث', 'BTL Radial Shockwave Therapy', 'shockwave_btl', 'غرفة الموجات التصادمية'),
('dev-btl4000', 'جهاز العلاج الكهربائي والموجات فوق الصوتية BTL 4000', 'BTL 4000 Smart Electro + Ultrasound', 'electrotherapy_ultrasound_btl4000', 'غرفة العلاج الطبيعي Bay 1'),
('dev-aircompression', 'جهاز التدليك بضغط الهواء وأحذية الضغط الليمفاوي', 'Air Compression Recovery Massage System', 'air_compression_boots', 'غرفة الاستشفاء والضغط'),
('dev-gym', 'أجهزة صالة التأهيل الرياضي والحركي والمتوازي', 'Medical Gym & Functional Training Set', 'medical_gym', 'صالة التأهيل الحركي'),
('dev-manual', 'علاج يدوي وتحريك مفاصل وتمارين فردية بدون أجهزة', 'Hands-on Clinical Joint Mobilization', 'manual_none', 'جميع غرف الكشف')
ON CONFLICT (id) DO NOTHING;

-- 4. PATIENTS DIRECTORY (Omani Civil IDs & Strict Gender Matching)
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civil_id VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    city VARCHAR(80) DEFAULT 'Barka',
    assigned_physio_id VARCHAR(50) REFERENCES public.staff(id),
    diagnosis TEXT NOT NULL,
    clinic_type VARCHAR(60) NOT NULL,
    baseline_pain_vas INT DEFAULT 8,
    current_pain_vas INT DEFAULT 3,
    insurance_provider VARCHAR(100),
    insurance_policy_no VARCHAR(60),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 5-DIMENSIONAL RESOURCE CONFLICT APPOINTMENTS
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    physio_id VARCHAR(50) REFERENCES public.staff(id) NOT NULL,
    bed_id VARCHAR(50) REFERENCES public.medical_beds(id) NOT NULL,
    device_id VARCHAR(50) REFERENCES public.medical_devices(id) NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    status VARCHAR(20) CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'waitlisted')) DEFAULT 'confirmed',
    procedure_name VARCHAR(180) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index to enforce fast clash detection in 5 dimensions
CREATE INDEX idx_appointments_clash_detection 
ON public.appointments (appointment_date, physio_id, bed_id, device_id, status);

-- 6. DEVELOPED SOAP NOTES & CLINICAL ASSESSMENTS
CREATE TABLE public.soap_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id),
    session_number INT NOT NULL,
    session_date DATE NOT NULL,
    physio_id VARCHAR(50) REFERENCES public.staff(id),
    subjective JSONB NOT NULL,
    objective JSONB NOT NULL,
    assessment JSONB NOT NULL,
    plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INTERACTIVE PAIN MAP TIMELINE POINTS
CREATE TABLE public.pain_map_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    soap_note_id UUID REFERENCES public.soap_notes(id) ON DELETE CASCADE,
    body_region VARCHAR(50) NOT NULL,
    view_type VARCHAR(15) CHECK (view_type IN ('anterior', 'posterior')) NOT NULL,
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    vas_score INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. COURSES & PACKAGES (10% OFF FOR 5+ SESSIONS)
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    package_name VARCHAR(150) NOT NULL,
    clinic_type VARCHAR(60) NOT NULL,
    total_sessions INT NOT NULL,
    completed_sessions INT DEFAULT 0,
    price_per_session NUMERIC(10,2) DEFAULT 15.00,
    discount_percent NUMERIC(5,2) DEFAULT 10.00,
    total_price NUMERIC(10,2) NOT NULL,
    amount_paid NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'expired')) DEFAULT 'active',
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL
);

-- 9. OMAN INSURANCE CLAIMS
CREATE TABLE public.insurance_claims (
    id VARCHAR(60) PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id),
    civil_id VARCHAR(30) NOT NULL,
    insurance_name VARCHAR(100) NOT NULL,
    policy_number VARCHAR(80) NOT NULL,
    approval_code VARCHAR(80) NOT NULL,
    diagnosis_icd10 VARCHAR(50) NOT NULL,
    service_date DATE NOT NULL,
    total_gross_omr NUMERIC(10,2) NOT NULL,
    copay_percent NUMERIC(5,2) NOT NULL,
    copay_amount_omr NUMERIC(10,2) NOT NULL,
    insurance_payable_omr NUMERIC(10,2) NOT NULL,
    claim_status VARCHAR(25) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_map_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated staff to read all data"
ON public.patients FOR SELECT TO authenticated USING (true);
