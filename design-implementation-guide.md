# PGA Brand Implementation Guide for InterviewOS

## Quick Start Implementation

### 1. Update Color System (globals.css)

Replace the current color definitions with PGA brand colors:

```css
:root {
  --radius: 2.5rem; /* Increased for rounder buttons */
  
  /* PGA Brand Colors */
  --pga-primary-blue: 41 91 116; /* #295B74 */
  --pga-secondary-blue: 103 148 167; /* #6794A7 */
  --pga-accent-orange: 252 138 70; /* #FC8A46 */
  --pga-light-bg: 203 225 234; /* #CBE1EA */
  --pga-dark-overlay: 30 68 88; /* #1E4458 */
  
  /* Applied to CSS variables */
  --background: 255 255 255; /* White */
  --foreground: 51 51 51; /* Dark gray for text */
  --card: 255 255 255;
  --card-foreground: 51 51 51;
  --popover: 255 255 255;
  --popover-foreground: 51 51 51;
  --primary: rgb(var(--pga-primary-blue));
  --primary-foreground: 255 255 255;
  --secondary: rgb(var(--pga-light-bg));
  --secondary-foreground: rgb(var(--pga-primary-blue));
  --muted: rgb(var(--pga-light-bg));
  --muted-foreground: 100 100 100;
  --accent: rgb(var(--pga-accent-orange));
  --accent-foreground: 255 255 255;
  --destructive: 239 68 68;
  --border: 229 231 235;
  --input: 229 231 235;
  --ring: rgb(var(--pga-primary-blue));
}
```

### 2. Update Typography (layout.tsx)

```tsx
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InterviewOS - Physician Growth Accelerator",
  description: "Transform your medical practice hiring process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --font-body: Arial, "Helvetica Neue", Helvetica, sans-serif;
          }
        `}</style>
      </head>
      <body
        className={`${workSans.variable} antialiased`}
        style={{ fontFamily: 'var(--font-body)' }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
```

### 3. Update Button Styles

Create a new button variant in your Button component:

```tsx
// In your button component variants
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 rounded-[40px]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-[40px]",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-[40px]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-[40px]",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-[40px]",
        link: "text-primary underline-offset-4 hover:underline",
        // New PGA variants
        pgaPrimary: "bg-[rgb(41,91,116)] text-white shadow-md hover:shadow-lg hover:bg-[rgb(41,91,116)]/90 rounded-[40px] transition-all duration-200",
        pgaAccent: "bg-[rgb(252,138,70)] text-white shadow-md hover:shadow-lg hover:bg-[rgb(252,138,70)]/90 rounded-[40px] transition-all duration-200",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-[30px] px-4 text-xs",
        lg: "h-12 rounded-[50px] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
  }
);
```

### 4. Update Homepage Hero Section

```tsx
// Updated hero section with PGA styling
<div className="min-h-screen bg-white">
  {/* Header */}
  <header className="border-b bg-white shadow-sm">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-semibold text-[rgb(41,91,116)] font-work-sans">
            InterviewOS
          </div>
          <span className="text-sm text-[rgb(103,148,167)]">by Physician Growth Accelerator</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="pgaAccent" size="lg">
            Schedule Consultation
          </Button>
        </nav>
      </div>
    </div>
  </header>

  {/* Hero Section with Dark Overlay */}
  <section className="relative bg-[rgb(30,68,88)] text-white py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-semibold font-work-sans mb-6">
          Transform Your Medical Practice Hiring Process
        </h1>
        <p className="text-xl mb-8 text-gray-100">
          Stop costly hiring mistakes. Build a high-performing team that energizes your practice.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="pgaAccent" size="lg">
            Start Your Assessment
          </Button>
          <Button variant="outline" size="lg" className="bg-white/10 text-white border-white hover:bg-white hover:text-[rgb(41,91,116)]">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  </section>
</div>
```

### 5. Update Card Components

```tsx
// Card with PGA styling
<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
  <CardHeader className="bg-[rgb(203,225,234)]">
    <CardTitle className="text-[rgb(41,91,116)] font-work-sans">
      Structured Interview Process
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6">
    <p className="text-gray-600">
      Our proven framework transforms vague requirements into measurable behaviors.
    </p>
  </CardContent>
</Card>
```

### 6. Form Styling Updates

```tsx
// Updated form inputs with PGA styling
<div className="space-y-4">
  <div>
    <Label className="text-[rgb(41,91,116)] font-medium mb-2">
      Job Description
    </Label>
    <Textarea
      className="rounded-2xl border-[rgb(203,225,234)] focus:border-[rgb(41,91,116)] focus:ring-[rgb(41,91,116)]"
      placeholder="Paste the full job description here..."
      rows={6}
    />
  </div>
  <Button variant="pgaPrimary" size="lg" className="w-full">
    Extract Requirements
  </Button>
</div>
```

### 7. Testimonial Component

```tsx
// Create a new testimonial component matching PGA style
export function TestimonialCard({ quote, author, title }: TestimonialProps) {
  return (
    <Card className="border-0 shadow-md bg-white">
      <CardContent className="pt-6">
        <Quote className="h-8 w-8 text-[rgb(103,148,167)] mb-4" />
        <p className="text-gray-600 italic mb-4">"{quote}"</p>
        <div className="border-t pt-4">
          <p className="font-semibold text-[rgb(41,91,116)]">{author}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 8. Section Backgrounds

```tsx
// Alternating section backgrounds
<section className="py-16 bg-white">
  {/* Content */}
</section>

<section className="py-16 bg-[rgb(203,225,234)]">
  {/* Content */}
</section>
```

### 9. Icon Integration

```tsx
// Use healthcare-appropriate icons
import { 
  Stethoscope, 
  HeartHandshake, 
  Users, 
  TrendingUp,
  Shield,
  CheckCircle 
} from "lucide-react";

// Icon with text pattern
<div className="flex items-start space-x-3">
  <div className="flex-shrink-0">
    <CheckCircle className="h-6 w-6 text-[rgb(252,138,70)]" />
  </div>
  <div>
    <h3 className="font-semibold text-[rgb(41,91,116)]">Reduce Turnover</h3>
    <p className="text-gray-600">Build a team that stays and grows with your practice</p>
  </div>
</div>
```

### 10. Mobile Responsive Updates

```css
/* Add to globals.css */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
    line-height: 2.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
```

## Testing Checklist

- [ ] Colors match PGA brand across all components
- [ ] Fonts load correctly (Work Sans for headings)
- [ ] Buttons have proper rounded corners (40-50px)
- [ ] Cards have soft shadows
- [ ] Forms are accessible and properly styled
- [ ] Mobile responsive at 375px, 768px, and 1440px
- [ ] Focus states are visible
- [ ] Hover states work correctly
- [ ] Loading states maintain brand consistency

## Brand Assets Needed

1. PGA Logo (SVG preferred)
2. Medical practice imagery
3. Icon set for healthcare concepts
4. Professional headshots for testimonials

## Performance Considerations

1. Optimize font loading with `font-display: swap`
2. Use CSS custom properties for easy theme switching
3. Lazy load images and non-critical assets
4. Minimize CSS bundle size

This implementation guide provides the foundation for updating InterviewOS to match the Physician Growth Accelerator brand standards.