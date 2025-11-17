import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  totalUsers: number;
  totalStudents: number;
  totalSessions: number;
  totalMessages: number;
  totalReports: number;
  avgSessionsPerStudent: number;
  avgMessagesPerSession: number;
  weeklyGrowth: {
    users: number;
    sessions: number;
  };
  topStudents: Array<{
    name: string;
    email: string;
    sessionCount: number;
  }>;
}

export function generateStatisticsReport(data: ReportData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add Thai font support (using default for now)
  doc.setFont('helvetica');
  
  // Header
  doc.setFillColor(99, 102, 241); // Primary color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('StudyBuddy System Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Statistics and Analysis Report', pageWidth / 2, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Date
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${currentDate}`, 14, 50);
  
  // Overview Section
  let yPos = 60;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('System Overview', 14, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Overview Stats Table
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Count', 'Weekly Growth']],
    body: [
      ['Total Users', data.totalUsers.toString(), `+${data.weeklyGrowth.users}`],
      ['Total Students', data.totalStudents.toString(), '-'],
      ['Total Sessions', data.totalSessions.toString(), `+${data.weeklyGrowth.sessions}`],
      ['Total Messages', data.totalMessages.toString(), '-'],
      ['Total Reports', data.totalReports.toString(), '-'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });
  
  // Performance Metrics
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Metrics', 14, yPos);
  
  yPos += 10;
  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Avg Sessions per Student', `${data.avgSessionsPerStudent.toFixed(2)} sessions`],
      ['Avg Messages per Session', `${data.avgMessagesPerSession.toFixed(2)} messages`],
      ['Engagement Rate', `${((data.totalSessions / data.totalUsers) * 100).toFixed(1)}%`],
      ['User Growth (Weekly)', `${data.weeklyGrowth.users > 0 ? '+' : ''}${data.weeklyGrowth.users} users`],
      ['Session Growth (Weekly)', `${data.weeklyGrowth.sessions > 0 ? '+' : ''}${data.weeklyGrowth.sessions} sessions`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });
  
  // Top Students Section
  if (data.topStudents && data.topStudents.length > 0) {
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Most Active Students', 14, yPos);
    
    yPos += 10;
    autoTable(doc, {
      startY: yPos,
      head: [['Rank', 'Name', 'Email', 'Sessions']],
      body: data.topStudents.map((student, index) => [
        `#${index + 1}`,
        student.name,
        student.email,
        `${student.sessionCount} sessions`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 10 },
    });
  }
  
  // Summary Section
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary and Insights', 14, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const insights = [
    `• System has ${data.totalUsers} total users, including ${data.totalStudents} students`,
    `• Average engagement: ${data.avgSessionsPerStudent.toFixed(1)} sessions per student`,
    `• Total of ${data.totalSessions} sessions and ${data.totalMessages} messages`,
    `• Weekly growth: +${data.weeklyGrowth.users} users, +${data.weeklyGrowth.sessions} sessions`,
    `• ${data.topStudents.length > 0 ? `Most active student: ${data.topStudents[0].name} (${data.topStudents[0].sessionCount} sessions)` : 'No active students yet'}`,
  ];
  
  insights.forEach((insight, index) => {
    doc.text(insight, 14, yPos + (index * 7));
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'StudyBuddy - AI Learning Assistant',
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  return doc;
}

export function downloadStatisticsReport(data: ReportData): void {
  const doc = generateStatisticsReport(data);
  const fileName = `studybuddy-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
