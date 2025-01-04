import { FileNode } from "@/hooks/useFileSystem";

interface WebPreviewProps {
  content: string;
}

export function WebPreview({ content }: WebPreviewProps) {
  const previewScript = `
    <script>
      // Session handling
      window.addEventListener('message', function(event) {
        if (event.data.type === 'session') {
          window.sessionData = event.data.session;
        }
      });

      // Error handling
      window.onerror = function(msg, url, line, col, error) {
        window.parent.postMessage({
          type: 'error',
          message: \`\${msg} (Line: \${line}, Col: \${col})\`
        }, '*');
        return false;
      };

      // Console interceptor
      const originalConsole = { ...console };
      Object.keys(console).forEach(key => {
        console[key] = (...args) => {
          originalConsole[key](...args);
          if (key === 'error' || key === 'warn' || key === 'log') {
            window.parent.postMessage({
              type: 'console',
              message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ')
            }, '*');
          }
        };
      });
    </script>
  `;

  return content.replace('<body>', '<body>' + previewScript);
}