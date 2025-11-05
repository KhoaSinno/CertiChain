'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { CreateCertificateRequest } from '@/src/types/certificate';
import { AlertCircle, BookOpen, FileText, Upload, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FilePreview } from './FilePreview';

interface Student {
  id: number;
  studentId: string;
  studentName: string;
}

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
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch students list on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudentsError('Không thể tải danh sách sinh viên');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isImage: file.type.startsWith('image/'),
        isPDF: file.type === 'application/pdf'
      });
      setSelectedFile(file);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      console.log('File dropped:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isImage: file.type.startsWith('image/'),
        isPDF: file.type === 'application/pdf'
      });
      setSelectedFile(file);
    } else {
      console.log('Invalid file type dropped:', file?.type);
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
      
      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - File Upload */}
          <div className="space-y-3">
            <label className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              File chứng chỉ (PDF/Image)
            </label>
            
            {selectedFile ? (
              <FilePreview
                file={selectedFile}
                onRemove={handleFileRemove}
                onReplace={handleFileReplace}
                className="min-h-[250px]"
              />
            ) : (
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
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload PDF or image file"
                />
                
                <div className="space-y-3 w-full">
                  <Upload className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <p className="text-sm md:text-base">
                    Kéo thả file vào đây hoặc{' '}
                    <span className="text-primary font-semibold underline decoration-2 underline-offset-2">chọn file</span>
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Chấp nhận PDF hoặc hình ảnh (JPG, PNG), tối đa 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-4 md:space-y-6 flex flex-col">
            {/* Student Selection */}
            <div className="space-y-2">
              <label className="text-sm md:text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Chọn sinh viên
              </label>
              
              {isLoadingStudents ? (
                <div className="h-10 md:h-11 rounded-md border bg-muted animate-pulse flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Đang tải...</span>
                </div>
              ) : studentsError ? (
                <div className="p-3 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs text-red-600">{studentsError}</span>
                </div>
              ) : (
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => {
                    const student = students.find(s => s.studentId === value);
                    if (student) {
                      setFormData(prev => ({
                        ...prev,
                        studentId: student.studentId,
                        studentName: student.studentName
                      }));
                      setSearchQuery('');
                      setIsSelectOpen(false);
                    }
                  }}
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                >
                  <SelectTrigger className="h-10 md:h-11">
                    <SelectValue placeholder="Tìm kiếm sinh viên..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 sticky top-0 bg-popover z-10">
                      <input
                        type="text"
                        placeholder="Tìm theo tên hoặc mã sinh viên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredStudents.length === 0 ? (
                        <div className="p-3 text-sm text-center text-muted-foreground">
                          {searchQuery ? 'Không tìm thấy sinh viên' : 'Không có sinh viên nào'}
                        </div>
                      ) : (
                        filteredStudents.map((student) => (
                          <SelectItem key={student.id} value={student.studentId}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{student.studentName}</span>
                              <span className="text-xs text-muted-foreground">({student.studentId})</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}
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
