'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Progress } from '@/src/components/ui/progress';
import { Textarea } from '@/src/components/ui/textarea';
import { CreateCertificateRequest } from '@/src/types/certificate';
import { BookOpen, FileText, Hash, Upload, User } from 'lucide-react';
import { useRef, useState } from 'react';

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
    <Card className={`w-full mx-auto bg-background/60 backdrop-blur-md border-border/50 shadow-lg-primary transition-all duration-500 ${className}`}>
      <CardHeader className="pb-4 pt-4 px-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Tạo chứng chỉ mới
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - File Upload */}
          <div className="space-y-3 h">
            <label className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              File chứng chỉ (PDF)
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg text-center h-90 transition-all duration-300 cursor-pointer group min-h-[250px] flex items-center justify-center ${
                dragActive 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg'
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
                <div className="space-y-3 animate-fade-in w-full">
                  <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm md:text-base font-semibold text-foreground break-words">{selectedFile.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  <Upload className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <p className="text-sm md:text-base">
                    Kéo thả file PDF vào đây hoặc{' '}
                    <span className="text-primary font-semibold underline decoration-2 underline-offset-2">chọn file</span>
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Chỉ chấp nhận file PDF, tối đa 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-4 md:space-y-6 flex flex-col">
            {/* Student Name */}
            <div className="space-y-2">
              <label className="text-sm md:text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Tên sinh viên
              </label>
              <Input
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Nhập tên sinh viên"
                className="text-sm md:text-base h-10 md:h-11"
                required
              />
            </div>
            
            {/* Student ID */}
            <div className="space-y-2">
              <label className="text-sm md:text-base font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Mã sinh viên
              </label>
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Nhập mã sinh viên"
                className="text-sm md:text-base h-10 md:h-11"
                required
              />
            </div>

            {/* Course Information */}
            <div className="space-y-2">
              <label className="text-sm md:text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Tên khóa học
              </label>
              <Textarea
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="Nhập tên khóa học hoặc chương trình đào tạo"
                rows={3}
                className="text-sm md:text-base resize-none"
                required
              />
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex justify-between text-sm md:text-base font-medium">
                  <span className="text-foreground">Đang xử lý...</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </div>
            )}

            {/* Submit Button - Styled with gradient blue glass effect */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full h-11 md:h-12 text-sm text-white md:text-base font-semibold btn-hover-lift bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                'Tạo chứng chỉ'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
