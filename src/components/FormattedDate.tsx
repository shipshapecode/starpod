type Props = {
  date: Date;
};

export default function FormattedDate({ date }: Props) {
  return (
    <time class="text-xs font-bold uppercase" datetime={date.toISOString()}>
      {date.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}
    </time>
  );
}
