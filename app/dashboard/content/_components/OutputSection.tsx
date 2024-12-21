import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  aiOutput: string;
}

function OutputSection({ aiOutput }: Props) {
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(aiOutput);  // Set the AI output in the editor
    }
  }, [aiOutput]);

  const handleCopy = () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getMarkdown();
      navigator.clipboard.writeText(content).then(() => {
        alert('Content copied!');
      }).catch((err) => {
        console.error('Failed to copy content:', err);
      });
    }
  };

  return (
    <div className='p-5 bg-white shadow-lg rounded-xl border-2 border-teal-500 hover:border-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_15px_6px_#10b981]'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='font-medium text-lg text-gray-800'>Your Result</h2>
        <Button className='flex gap-2 text-teal-500 hover:text-teal-600' onClick={handleCopy}>
          <Copy className='w-4 h-4' /> Copy
        </Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your Result will appear here"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        onChange={() => console.log(editorRef.current?.getInstance().getMarkdown())}
      />
    </div>
  );
}

export default OutputSection;
