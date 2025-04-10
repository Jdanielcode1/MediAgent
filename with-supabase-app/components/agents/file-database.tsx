"use client";

import { useState, useRef } from "react";
import { Database, Upload, File, FileText, Trash2, Download, Search, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  description?: string;
}

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "patient_tracking_requirements.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2023-06-15",
    description: "Document outlining patient tracking requirements for Medicare compliance"
  },
  {
    id: "2",
    name: "competitor_analysis_2023.xlsx",
    type: "excel",
    size: "1.8 MB",
    uploadDate: "2023-06-10",
    description: "Analysis of competing wound care tracking solutions"
  },
  {
    id: "3",
    name: "sales_pitch_deck.pptx",
    type: "powerpoint",
    size: "5.2 MB",
    uploadDate: "2023-06-05",
    description: "Presentation for healthcare facilities highlighting our solution"
  },
  {
    id: "4",
    name: "target_facilities_list.csv",
    type: "csv",
    size: "0.5 MB",
    uploadDate: "2023-06-18",
    description: "List of Medicare-certified facilities with manual tracking systems"
  }
];

export default function FileDatabase({ agentId }: { agentId: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileDescription, setFileDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Add the new file to the list
          const newFile: FileItem = {
            id: Date.now().toString(),
            name: file.name,
            type: file.name.split('.').pop() || "unknown",
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split('T')[0],
            description: fileDescription
          };
          
          setFiles([newFile, ...files]);
          setIsUploading(false);
          setUploadProgress(0);
          setFileDescription("");
        }, 500);
      }
    }, 300);
  };
  
  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'excel':
      case 'csv':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'powerpoint':
        return <FileText className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-blue-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Agent Knowledge Base
        </h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File to Agent Knowledge Base</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and drop your file here, or{" "}
                    <button 
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF, DOCX, XLSX, CSV, PPTX (Max 10MB)
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">File Description</label>
                <Input
                  placeholder="Describe what's in this file..."
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Adding a description helps the agent understand the context of this file
                </p>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="text-sm flex justify-between">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search files..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="mr-4">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{file.name}</h3>
                    {file.description && (
                      <p className="text-sm text-gray-500 mt-1">{file.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Size: {file.size}</span>
                      <span>Uploaded: {file.uploadDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No files found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? "Try a different search term" : "Upload files to provide context for this agent"}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}