import { student } from '@/data/student';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

export function TopBar() {
  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-display tracking-[-0.025em] text-text-primary">
          {getGreeting()}, {student.firstName}
        </h1>
        <p className="text-body text-text-secondary mt-1">
          Here's how your preparation is moving this week.
        </p>
      </div>
      <div className="flex items-center gap-4 pt-1">
        <time className="text-body-sm text-text-tertiary font-medium" dateTime={new Date().toISOString()}>
          {getFormattedDate()}
        </time>
        <div className="w-9 h-9 rounded-full bg-accent hidden lg:flex items-center justify-center">
          <span className="text-[0.75rem] font-semibold text-white leading-none">
            {student.avatarInitials}
          </span>
        </div>
      </div>
    </header>
  );
}
