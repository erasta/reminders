interface MessageProps {
  type: 'success' | 'error';
  message: string;
}

export function Message({ type, message }: MessageProps) {
  if (!message) return null;
  
  return (
    <div className={`text-sm mt-2 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
      {message}
    </div>
  );
} 