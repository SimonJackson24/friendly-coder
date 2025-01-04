import { FileNode } from "@/hooks/useFileSystem";

interface AndroidPreviewProps {
  layoutContent: string;
}

export function AndroidPreview({ layoutContent }: AndroidPreviewProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
          }
          .android-frame {
            width: 360px;
            height: 640px;
            background: white;
            border-radius: 20px;
            position: relative;
            border: 12px solid #1a1a1a;
            overflow: hidden;
          }
          .android-content {
            padding: 16px;
            height: 100%;
            overflow: auto;
          }
          .status-bar {
            height: 24px;
            background: #2196F3;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="android-frame">
          <div class="status-bar"></div>
          <div class="android-content">
            <pre>${layoutContent}</pre>
          </div>
        </div>
        <script>
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
      </body>
    </html>
  `;
}