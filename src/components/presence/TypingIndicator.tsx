export default function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-[2px] ml-1">
      <span className="typing-dot w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--muted)' }} />
      <span className="typing-dot w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--muted)' }} />
      <span className="typing-dot w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--muted)' }} />
    </span>
  );
}
