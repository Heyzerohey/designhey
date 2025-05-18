import { useState, useRef, useCallback } from "react";
import { UploadCloudIcon, FileIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  onFilesUploaded: (files: File[]) => void;
  businessName?: string;
  acceptedFileTypes?: string;
  maxFiles?: number;
  className?: string;
}

export default function FileUploadArea({
  onFilesUploaded,
  businessName = "[Your Business Name]",
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxFiles = 10,
  className,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const validFiles = fileArray.filter((file) => {
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        return acceptedFileTypes
          .split(",")
          .some((type) => type.includes(fileExtension));
      });

      // Limit to max files
      const combinedFiles = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(combinedFiles);
      onFilesUploaded(combinedFiles);
    },
    [files, acceptedFileTypes, maxFiles, onFilesUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileIcon className="h-5 w-5 text-red-500" />;

      case "doc":
      case "docx":
        return <FileIcon className="h-5 w-5 text-blue-500" />;

      case "jpg":
      case "jpeg":
      case "png":
        return <FileIcon className="h-5 w-5 text-green-500" />;

      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging
            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500",
          "cursor-pointer"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          multiple
          accept={acceptedFileTypes}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloudIcon
            className={cn(
              "h-12 w-12 mb-2",
              isDragging
                ? "text-orange-500"
                : "text-gray-400 dark:text-gray-500"
            )}
          />

          <h3 className="text-lg font-medium">
            {isDragging ? "Drop files here" : "Upload your documents"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop your files here or click to browse
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {businessName} accepts {acceptedFileTypes.replace(/\./g, "")} files
            (max {maxFiles} files)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">
            Selected Files ({files.length}/{maxFiles})
          </h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md text-sm"
              >
                <div className="flex items-center space-x-2 truncate max-w-[80%]">
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <XIcon className="h-4 w-4" />

                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
