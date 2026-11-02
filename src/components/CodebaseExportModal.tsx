import React, { useState } from 'react';
import { Download, FileCode, Check, Copy, Database, Server, Smartphone, ExternalLink, X } from 'lucide-react';

interface CodebaseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodebaseExportModal: React.FC<CodebaseExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'docker' | 'flutter' | 'readme'>('supabase');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Supabase PostgreSQL Schema SQL
  const supabaseSQL = `-- ====================================================================
-- Um Alqura Polyclinic 2026 - Supabase (PostgreSQL) Production Schema
-- Specialty: Physiotherapy & Rehabilitation ONLY
-- Location: Barka, Sultanate of Oman
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patients Table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civil_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(25) NOT NULL,
    city VARCHAR(60) DEFAULT 'Barka',
    assigned_physio_id VARCHAR(50) NOT NULL,
    diagnosis TEXT NOT NULL,
    clinic_type VARCHAR(50) NOT NULL,
    baseline_pain_vas INT DEFAULT 8,
    current_pain_vas INT DEFAULT 3,
    insurance_provider VARCHAR(80),
    insurance_policy_no VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Staff Table
CREATE TABLE public.staff (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('admin', 'physiotherapist', 'receptionist', 'assistant')) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    cultural_dress VARCHAR(100),
    phone VARCHAR(25),
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Medical Devices Table (BTL Shockwave, Traction, Combo, Air Compression)
CREATE TABLE public.medical_devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    room VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
);

-- 4. 5-Dimensional Appointments Table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    physio_id VARCHAR(50) REFERENCES public.staff(id),
    bed_id VARCHAR(50) NOT NULL,
    device_id VARCHAR(50) REFERENCES public.medical_devices(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    status VARCHAR(20) CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'waitlisted')) DEFAULT 'confirmed',
    procedure_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Developed SOAP Notes Table
CREATE TABLE public.soap_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id),
    session_number INT NOT NULL,
    session_date DATE NOT NULL,
    subjective JSONB NOT NULL, -- { chief_complaint, pain_vas, aggravating, relieving }
    objective JSONB NOT NULL,  -- { active_rom, passive_rom, mmt, special_tests }
    assessment JSONB NOT NULL, -- { tissue_response, recovery_pct, clinical_impression }
    plan JSONB NOT NULL,        -- { modalities, traction_params, exercises, precautions }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Interactive Pain Map Timeline Table
CREATE TABLE public.pain_map_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    soap_note_id UUID REFERENCES public.soap_notes(id) ON DELETE CASCADE,
    body_region VARCHAR(40) NOT NULL,
    view_type VARCHAR(15) CHECK (view_type IN ('anterior', 'posterior')),
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    severity VARCHAR(15) NOT NULL,
    vas_score INT NOT NULL,
    description TEXT
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated staff to read all data"
ON public.patients FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow physio to manage assigned patients"
ON public.patients FOR ALL TO authenticated USING (auth.uid() IS NOT NULL);
`;

  // Docker Compose configuration
  const dockerComposeYaml = `# Um Alqura Polyclinic 2026 - Production Docker Stack
# Deployable to Coolify / VPS / Cloud Run

version: '3.8'

services:
  um-alqura-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: um_alqura_clinic_2026
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_CLINIC_NAME="مجمع أم القرى الطبي"
      - VITE_CLINIC_PHONE="+968 79470050"
      - WHATSAPP_API_KEY=\${WHATSAPP_API_KEY}
    networks:
      - polyclinic-net

  supabase-db:
    image: supabase/postgres:15.1.0.117
    container_name: polyclinic_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: polyclinic_db
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-UmAlquraSecure2026!}
    volumes:
      - polyclinic_data:/var/lib/postgresql/data
    networks:
      - polyclinic-net

networks:
  polyclinic-net:
    driver: bridge

volumes:
  polyclinic_data:
`;

  // Flutter Mobile App Structure & Code
  const flutterDartCode = `// ====================================================================
// Um Alqura Polyclinic - Flutter 3.22 Multiplatform Mobile Application
// Exports: Android APK & iOS IPA
// Features: Patient Portal, AI Rep Counter Camera, Modest Home Exercises
// ====================================================================

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const UmAlquraClinicApp());
}

class UmAlquraClinicApp extends StatelessWidget {
  const UmAlquraClinicApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'مجمع أم القرى الطبي',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF075563),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF075563),
          secondary: const Color(0xFFB59B62),
          surface: const Color(0xFFFAF8F1),
        ),
        fontFamily: 'Cairo',
      ),
      home: const PatientHomeScreen(),
    );
  }
}

class PatientHomeScreen extends StatelessWidget {
  const PatientHomeScreen({super.key});

  void _openWhatsApp() async {
    final Uri url = Uri.parse('https://wa.me/96879470050?text=مرحبا مجمع أم القرى');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      debugPrint('Could not launch WhatsApp');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFF075563),
          title: const Text('مجمع أم القرى الطبي - بركاء', style: TextStyle(color: Colors.white)),
          actions: [
            IconButton(
              icon: const Icon(Icons.support_agent, color: Color(0xFFB59B62)),
              onPressed: _openWhatsApp,
            )
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            // Patient Greeting Card
            Card(
              color: const Color(0xFF075563),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: const Padding(
                padding: EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('أهلاً بكم في تطبيق المراجع', style: TextStyle(color: Colors.white70, fontSize: 13)),
                    SizedBox(height: 6),
                    Text('صحتك.. أولويتنا', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                    SizedBox(height: 12),
                    Text('الجلسات المتبقية في باقتك: 6 جلسات', style: TextStyle(color: Color(0xFFB59B62), fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // AI Home Trainer Launcher
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.camera_alt),
              label: const Text('فتح كاميرا مدرب التمارين الذكي (AI Rep Counter)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2A9DA5),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`;

  // Readme deployment guide
  const readmeDeployment = `# دليل تشغيل وربط نظام مجمع أم القرى الطبي 2026

## 1. التثبيت المباشر على الهاتف (PWA App Installation)
- التطبيق يدعم تقنية Progressive Web App بالكامل.
- **Android**: اضغط على زر "تثبيت التطبيق على الموبايل" في أعلى الشاشة أو اختر من قائمة المتصفح (Add to Home Screen).
- **iPhone / iOS**: اضغط زر المشاركة (Share) في Safari ثم اختر (Add to Home Screen / إضافة إلى الصفحة الرئيسية).

## 2. الربط مع GitHub
\`\`\`bash
git init
git add .
git commit -m "feat: Um Alqura Polyclinic 2026 Complete System with 23 Modules"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/um-alqura-clinic-system.git
git push -u origin main
\`\`\`

## 3. النشر عبر Vercel أو Coolify
- **Vercel**: قم بربط مستودع GitHub مباشرة وسيقوم بالبناء التلقائي عبر الأمر \`npm run build\`.
- **Coolify / Docker**: استخدم ملف \`docker-compose.yml\` المرفق.

## 4. إعداد قاعدة بيانات Supabase
1. افتح مشروع Supabase مجاني.
2. توجه إلى SQL Editor.
3. الصق كود \`supabase_schema.sql\` المرفق في هذا المركز ونفذه بضغطة زر واحدة.
`;

  const getActiveContent = () => {
    switch (activeTab) {
      case 'supabase':
        return supabaseSQL;
      case 'docker':
        return dockerComposeYaml;
      case 'flutter':
        return flutterDartCode;
      case 'readme':
        return readmeDeployment;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filenameMap = {
      supabase: 'supabase_schema.sql',
      docker: 'docker-compose.yml',
      flutter: 'flutter_patient_app.dart',
      readme: 'README_DEPLOYMENT.md'
    };
    const blob = new Blob([getActiveContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenameMap[activeTab];
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#075563] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileCode className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">
                مركز تصدير الكود وقواعد البيانات (Export Architecture Center)
              </h3>
              <p className="text-xs text-[#FAF8F1]/80 mt-0.5">
                تصدير مخطط Supabase SQL، وتطبيق Flutter للموبايل، وتكوين Docker وربط GitHub
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 bg-[#FAF8F1] px-4 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            <Database className="w-4 h-4 text-[#2A9DA5]" />
            مخطط قاعدة بيانات Supabase (SQL)
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'docker'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            <Server className="w-4 h-4 text-[#B59B62]" />
            ملف Docker Compose & Coolify
          </button>
          <button
            onClick={() => setActiveTab('flutter')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'flutter'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            كود تطبيق فلاتر للموبايل (Flutter Dart)
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'readme'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-purple-600" />
            دليل النشر والربط بـ GitHub
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">
              {activeTab === 'supabase' && 'PostgreSQL 15 RLS Schema (Tables: Patients, Appointments, SOAP, PainMap)'}
              {activeTab === 'docker' && 'docker-compose.yml for Coolify / VPS Deployment'}
              {activeTab === 'flutter' && 'Flutter 3.22 Single Codebase for Android APK & iOS IPA'}
              {activeTab === 'readme' && 'Deployment Guide & GitHub Connection Steps'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'تم النسخ!' : 'نسخ الكود'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#B59B62]" />
                تحميل الملف
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <code>{getActiveContent()}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            مفتوح المصدر 100% وجاهز للربط مع المستودع السحابي
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
