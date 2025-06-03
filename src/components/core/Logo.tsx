import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="20"
        fill="hsl(var(--primary))"
        className="font-headline"
      >
        St.Us Collections
      </text>
    </svg>
  );
}
