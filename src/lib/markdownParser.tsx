/**
 * Simple markdown parser to render AI responses properly
 * Handles common markdown patterns that cause display issues
 */

/**
 * Parse markdown text and return JSX with proper formatting
 */
export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split text into lines for processing
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      elements.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }
    
    // Check for headings (# Heading, ## Heading, ### Heading)
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const headingStyles: Record<number, string> = {
        1: 'text-2xl font-bold mt-4 mb-2',
        2: 'text-xl font-bold mt-3 mb-2',
        3: 'text-lg font-semibold mt-2 mb-1',
        4: 'text-base font-semibold mt-2 mb-1',
        5: 'text-sm font-medium mt-1 mb-1',
        6: 'text-sm font-medium mt-1 mb-1',
      };
      elements.push(
        <div key={`h-${i}`} className={headingStyles[level] || 'text-base font-semibold'}>
          {parseInline(content)}
        </div>
      );
      i++;
      continue;
    }
    
    // Check for bullet points (- item or * item)
    const bulletMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 ml-4 my-1">
          <span className="text-[#E41B17] mt-1">•</span>
          <span className="flex-1">{parseInline(bulletMatch[1])}</span>
        </div>
      );
      i++;
      continue;
    }
    
    // Check for numbered lists (1. item, 2. item)
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      elements.push(
        <div key={`ol-${i}`} className="flex items-start gap-2 ml-4 my-1">
          <span className="text-[#E41B17] font-medium min-w-[20px]">{numberedMatch[1]}.</span>
          <span className="flex-1">{parseInline(numberedMatch[2])}</span>
        </div>
      );
      i++;
      continue;
    }
    
    // Check for horizontal rules
    if (trimmedLine.match(/^[-*_]{3,}$/)) {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-gray-200" />);
      i++;
      continue;
    }
    
    // Regular paragraph
    elements.push(
      <div key={`p-${i}`} className="my-2">
        {parseInline(trimmedLine)}
      </div>
    );
    i++;
  }
  
  return elements;
}

/**
 * Parse inline markdown (bold, italic, links, etc.)
 */
function parseInline(text: string): React.ReactNode {
  if (!text) return null;
  
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  // Pattern for bold (**text**)
  const boldRegex = /\*\*(.+?)\*\*/g;
  // Pattern for italic (*text* or _text_)
  const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|_(.+?)_/g;
  // Pattern for inline code (`code`)
  const codeRegex = /`(.+?)`/g;
  // Pattern for links [text](url)
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  
  // Process bold text
  const boldParts: { start: number; end: number; content: string }[] = [];
  let match;
  const boldRegexClone = new RegExp(boldRegex.source, 'g');
  while ((match = boldRegexClone.exec(text)) !== null) {
    boldParts.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
    });
  }
  
  // If no bold, return simple text
  if (boldParts.length === 0) {
    return <span>{text}</span>;
  }
  
  // Rebuild string with bold
  let lastIndex = 0;
  boldParts.forEach((bold) => {
    // Add text before bold
    if (bold.start > lastIndex) {
      parts.push(<span key={`t-${key++}`}>{text.slice(lastIndex, bold.start)}</span>);
    }
    // Add bold text
    parts.push(
      <strong key={`b-${key++}`} className="font-semibold">
        {bold.content}
      </strong>
    );
    lastIndex = bold.end;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }
  
  return parts.length > 0 ? parts : text;
}

/**
 * Clean text by removing common LaTeX-style escaping
 */
export function cleanLatexText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove escaped hashtags at the start of headings that aren't actually headings
    .replace(/\\#/g, '#')
    // Remove escaped asterisks
    .replace(/\\\*/g, '*')
    // Remove escaped underscores
    .replace(/\\_/g, '_')
    // Remove escaped backticks
    .replace(/\\`/g, '`')
    // Clean up double quotes that might be curly quotes
    .replace(/[""]/g, '"')
    .replace(/[""]/g, '"')
    // Clean up single quotes
    .replace(/[''']/g, "'")
    .replace(/[''']/g, "'")
    // Remove LaTeX command remnants like \textbf, \emph, etc.
    .replace(/\\text(bf|it|rm|sc|sf|tt)\{([^}]+)\}/g, '$2')
    .replace(/\\emph\{([^}]+)\}/g, '$1')
    .replace(/\\textbf\{([^}]+)\}/g, '$1')
    // Remove extra whitespace
    .trim();
}
