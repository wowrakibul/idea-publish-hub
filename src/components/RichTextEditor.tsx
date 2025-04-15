
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Link, 
  Image as ImageIcon,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autofocus?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  autofocus = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      // Force update the content
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      editorRef.current.focus();
    }
  };

  const handleLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      document.execCommand('insertImage', false, url);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleHeading = (level: 1 | 2) => {
    document.execCommand('formatBlock', false, `h${level}`);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const handleCodeBlock = () => {
    document.execCommand('formatBlock', false, 'pre');
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleCommand('bold')}
          className="w-8 h-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleCommand('italic')}
          className="w-8 h-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleCommand('underline')}
          className="w-8 h-8"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1"></div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleHeading(1)}
          className="w-8 h-8"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleHeading(2)}
          className="w-8 h-8"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1"></div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleCommand('insertUnorderedList')}
          className="w-8 h-8"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => handleCommand('insertOrderedList')}
          className="w-8 h-8"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1"></div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleLink}
          className="w-8 h-8"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleImage}
          className="w-8 h-8"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCodeBlock}
          className="w-8 h-8"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "min-h-[200px] p-4 focus:outline-none focus:ring-0",
          isFocused ? "bg-background" : "bg-background",
          !value && !isFocused && "text-muted-foreground"
        )}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};
