# Lessons Folder

This folder contains the PDF files for your team's lessons.

## How to Add Your Real Lessons

1. **Convert your Google Slides/Docs to PDFs**
   - Download your Google Slides/Docs as PDF files
   - Name them descriptively (e.g., `congressional-fundamentals.pdf`)

2. **Place PDFs in this folder**
   - Copy your PDF files to `/public/lessons/`
   - Make sure the filenames match what you'll reference in the code

3. **Update the lessons data**
   - Open `app/lessons/page.tsx`
   - Find the lesson you want to update
   - Uncomment and set the `pdfUrl` and `isPdfLesson` properties:

```typescript
{
  id: 1,
  title: "Your Real Lesson Title",
  description: "Your lesson description",
  // ... other properties ...
  pdfUrl: "/lessons/your-pdf-filename.pdf", // Set this to your PDF path
  isPdfLesson: true, // Set this to true for PDF lessons
}
```

## Security Features

- PDFs are embedded in iframes that prevent downloading
- Right-click is disabled on the PDF viewer
- PDF toolbar and navigation are disabled
- Content is only accessible to authenticated team members

## Example File Structure

```
public/lessons/
├── README.md
├── congressional-fundamentals.pdf
├── bill-writing-guide.pdf
├── advanced-argumentation.pdf
├── evidence-research.pdf
├── parliamentary-procedure.pdf
└── cross-examination.pdf
```

## Notes

- Keep your PDF files organized and well-named
- The system will automatically handle the secure display
- Students cannot download or save the PDFs
- Only team members with access to your website can view the lessons 