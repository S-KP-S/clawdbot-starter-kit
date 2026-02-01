# Excel Template Skill for fPna

## Description
Creates professionally styled Excel workbook templates with fPna branding standards.

## Invocation
`/excel-template [filename]`

## Brand Standards
- **Primary Color (Headers)**: Sky Blue (#87CEEB)
- **Secondary Color (Alternating Rows)**: Light Yellow (#FFFACD)
- **Font Family**: Calibri
- **Font Sizes**: Title 16pt, Headers 12pt bold, Body 11pt

## Output Location
`C:\Users\spenc\Templates\`

## Template Elements

### Title Block (Rows 1-3)
- Row 1: Company name "fPna" in sky blue, Calibri 16pt bold
- Row 2: Template title (user-specified), Calibri 14pt
- Row 3: Date generated, Calibri 11pt italic

### Header Row (Row 5)
- Background: Sky Blue (#87CEEB)
- Text: White (#FFFFFF), Calibri 12pt bold
- Borders: Thin bottom border

### Data Rows (Starting Row 6)
- Alternating colors: White and Light Yellow (#FFFACD)
- Font: Calibri 11pt
- Alignment: Left for text, right for numbers

### Summary Section (Bottom)
- Label row with "Total", "Average", "Count" formulas
- Background: Sky Blue (#87CEEB) with white text
- Formulas: SUM, AVERAGE, COUNTA for numeric columns

## Print-Ready Settings
- Page orientation: Landscape
- Margins: 0.5 inches all sides
- Header: "fPna - [Template Name]"
- Footer: "Page &P of &N | Generated: &D"
- Repeat title rows on each page

## Chart Styling
When charts are added:
- Primary series: Sky Blue (#87CEEB)
- Secondary series: Light Yellow (#FFFACD)
- Accent colors: #5DADE2, #F7DC6F
- Font: Calibri for all labels
- No chart border, light gray gridlines

## Instructions for Claude

When the user invokes `/excel-template`, execute the Python script at:
`C:\Users\spenc\Templates\fpna_excel_generator.py`

Pass arguments:
- `--name`: Filename for the template (required)
- `--title`: Title to display in the workbook (optional, defaults to filename)
- `--columns`: Comma-separated column headers (optional)
- `--rows`: Number of sample data rows to create (optional, default 10)

Example usage:
```
/excel-template budget_2024
/excel-template --name "Q1 Report" --title "Q1 Financial Report" --columns "Item,Category,Amount,Date"
```

The script will create a fully formatted .xlsx file with all brand standards applied.
