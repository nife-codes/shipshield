/**
 * Export utilities for generating downloadable reports
 * Uses only vanilla JavaScript and browser APIs - NO EXTERNAL DEPENDENCIES
 */

/**
 * Triggers a file download in the browser
 * @param {Blob} blob - File blob to download
 * @param {string} filename - Name of the downloaded file
 */
const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Exports analysis data as JSON
 * @param {Object} analysisData - Analysis data to export
 * @param {string} repoName - Repository name for filename
 */
export const exportAsJSON = (analysisData, repoName = 'report') => {
    const json = JSON.stringify(analysisData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `${repoName.replace(/[^a-z0-9]/gi, '_')}_analysis_${Date.now()}.json`;
    downloadFile(blob, filename);
};

/**
 * Exports analysis data as CSV
 * @param {Object} analysisData - Analysis data to export
 * @param {string} repoName - Repository name for filename
 */
export const exportAsCSV = (analysisData, repoName = 'report') => {
    if (!analysisData) return;

    const { score, categories } = analysisData;

    // CSV Header
    let csv = 'Category,Score,Percentage,Issues\n';

    // Add rows for each category
    if (categories) {
        Object.entries(categories).forEach(([categoryName, categoryData]) => {
            const percentage = ((categoryData.score / 25) * 100).toFixed(2);
            const issues = categoryData.issues.join('; ').replace(/,/g, ' ');
            csv += `"${categoryName}","${categoryData.score}","${percentage}%","${issues}"\n`;
        });
    }

    // Add total score row
    csv += `\nTotal Score,${score},${score}%,\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const filename = `${repoName.replace(/[^a-z0-9]/gi, '_')}_analysis_${Date.now()}.csv`;
    downloadFile(blob, filename);
};

/**
 * Exports analysis data as HTML report
 * @param {Object} analysisData - Analysis data to export
 * @param {string} repoName - Repository name for filename
 */
export const exportAsHTML = (analysisData, repoName = 'report') => {
    if (!analysisData) return;

    const { score, categories, repoUrl, topIssues } = analysisData;
    const date = new Date().toLocaleDateString();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShipShield Analysis Report - ${repoName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Special+Gothic+Expanded+One&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary-color: #4F5BD5;
      --primary-dark: #3b82f6;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-500: #6b7280;
      --gray-700: #374151;
      --gray-900: #111827;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: var(--gray-50);
      color: var(--gray-900);
      line-height: 1.6;
    }
    
    h1, h2, h3 {
      font-family: 'Special Gothic Expanded One', sans-serif;
      color: var(--gray-900);
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 2.5rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header h1 {
      color: white;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .header p {
      font-size: 0.875rem;
      opacity: 0.95;
      margin: 0.25rem 0;
    }
    
    .score-badge {
      font-size: 3.5rem;
      font-weight: 700;
      margin: 1.5rem 0;
      font-family: 'Montserrat', sans-serif;
    }
    
    .production-ready {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 700;
      margin-top: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .not-ready {
      display: inline-block;
      background: #fde68a;
      color: #b45309;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 700;
      margin-top: 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin: 2rem 0 1rem 0;
      color: var(--gray-900);
    }
    
    .category {
      background: white;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 0.75rem;
      
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .category h3 {
      color: var(--primary-color);
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    
    .score-info {
      font-size: 0.875rem;
      color: var(--gray-700);
      font-weight: 600;
      margin: 0.5rem 0;
    }
    
    .progress-bar {
      background: var(--gray-200);
      height: 0.75rem;
      border-radius: 0.375rem;
      overflow: hidden;
      margin: 1rem 0;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
      height: 100%;
      border-radius: 0.375rem;
      transition: width 0.3s ease;
    }
    
    .issues-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }
    
    .issues-title {
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
    }
    
    .issue-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid #fee2e2;
      font-size: 0.875rem;
      color: var(--gray-700);
    }
    
    .issue-item:last-child {
      border-bottom: none;
    }
    
    .success-message {
      color: #059669;
      font-weight: 600;
      padding: 0.75rem;
      background: #d1fae5;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--gray-200);
      color: var(--gray-500);
      font-size: 0.875rem;
    }
    
    @media print {
      body {
        background: white;
      }
      .category {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ ShipShield Analysis Report</h1>
    <p><strong>Repository:</strong> ${repoUrl || repoName}</p>
    <p><strong>Generated:</strong> ${date}</p>
    <div class="score-badge">Overall Score: ${score}/100</div>
    ${score >= 80
            ? '<div class="production-ready">🎉 Production Ready!</div>'
            : '<div class="not-ready">⚠️ Not Production Ready</div>'
        }
  </div>

  <h2 class="section-title">Category Breakdown</h2>
  ${Object.entries(categories || {}).map(([name, data]) => {
            const percentage = ((data.score / 25) * 100).toFixed(1);
            const categoryName = name.replace(/([A-Z])/g, ' $1').trim();
            return `
    <div class="category">
      <h3>${categoryName}</h3>
      <p class="score-info">Score: ${data.score}/25 (${percentage}%)</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      ${data.issues.length > 0 ? `
        <div class="issues-box">
          <div class="issues-title">Issues Found:</div>
          ${data.issues.map(issue => `<div class="issue-item">• ${issue}</div>`).join('')}
        </div>
      ` : '<div class="success-message">✅ No issues found!</div>'}
    </div>
    `;
        }).join('')}

  ${topIssues && topIssues.length > 0 ? `
    <h2 class="section-title">Top Priority Issues</h2>
    <div class="issues-box">
      ${topIssues.map((issue, i) => `<div class="issue-item">${i + 1}. ${issue}</div>`).join('')}
    </div>
  ` : ''}

  <div class="footer">
    <p>Generated by ShipShield • Repository Security & Quality Analysis</p>
  </div>
</body>
</html>
  `.trim();

    const blob = new Blob([html], { type: 'text/html' });
    const filename = `${repoName.replace(/[^a-z0-9]/gi, '_')}_analysis_${Date.now()}.html`;
    downloadFile(blob, filename);
};

/**
 * Exports analysis data as plain text
 * @param {Object} analysisData - Analysis data to export
 * @param {string} repoName - Repository name for filename
 */
export const exportAsText = (analysisData, repoName = 'report') => {
    if (!analysisData) return;

    const { score, categories, repoUrl, topIssues } = analysisData;
    const date = new Date().toLocaleDateString();

    let text = `
╔════════════════════════════════════════════════════════════╗
║           SHIPSHIELD ANALYSIS REPORT                      ║
╚════════════════════════════════════════════════════════════╝

Repository: ${repoUrl || repoName}
Generated: ${date}
Overall Score: ${score}/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    if (categories) {
        Object.entries(categories).forEach(([name, data]) => {
            const percentage = ((data.score / 25) * 100).toFixed(1);
            const categoryName = name.replace(/([A-Z])/g, ' $1').trim();

            text += `\n${categoryName.toUpperCase()}\n`;
            text += `${'─'.repeat(60)}\n`;
            text += `Score: ${data.score}/25 (${percentage}%)\n`;

            if (data.issues.length > 0) {
                text += `\nIssues:\n`;
                data.issues.forEach(issue => {
                    text += `  • ${issue}\n`;
                });
            } else {
                text += `✅ No issues found!\n`;
            }
            text += '\n';
        });
    }

    if (topIssues && topIssues.length > 0) {
        text += `\nTOP PRIORITY ISSUES\n`;
        text += `${'─'.repeat(60)}\n`;
        topIssues.forEach((issue, i) => {
            text += `${i + 1}. ${issue}\n`;
        });
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Generated by ShipShield • Repository Security & Quality Analysis\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const filename = `${repoName.replace(/[^a-z0-9]/gi, '_')}_analysis_${Date.now()}.txt`;
    downloadFile(blob, filename);
};
