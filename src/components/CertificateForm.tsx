'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CreateCertificateRequest } from '@/types/certificate';
import { Upload, FileText, User, BookOpen, Hash } from 'lucide-react';

interface CertificateFormProps {
  onSubmit: (data: CreateCertificateRequest) => void;
  isLoading?: boolean;
  progress?: number;
  className?: string;
}

export function CertificateForm({ 
  onSubmit, 
  isLoading = false, 
  progress = 0,
  className = "" 
}: CertificateFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    courseName: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && formData.studentName && formData.studentId && formData.courseName) {
      onSubmit({
        ...formData,
        file: selectedFile
      });
    }
  };

  const isFormValid = selectedFile && formData.studentName && formData.studentId && formData.courseName;

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Tạo chứng chỉ mới
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">File chứng chỉ (PDF)</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload PDF file"
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm">
                    Kéo thả file PDF vào đây hoặc{' '}
                    <span className="text-primary cursor-pointer">chọn file</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chỉ chấp nhận file PDF, tối đa 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Tên sinh viên
              </label>
              <Input
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Nhập tên sinh viên"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Mã sinh viên
              </label>
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Nhập mã sinh viên"
                required
              />
            </div>
          </div>

          {/* Course Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tên khóa học
            </label>
            <Textarea
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              placeholder="Nhập tên khóa học hoặc chương trình đào tạo"
              rows={3}
              required
            />
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đang xử lý...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Đang tạo chứng chỉ...' : 'Tạo chứng chỉ'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
