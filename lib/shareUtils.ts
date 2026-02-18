import { VoterResult } from './voterService';

/**
 * Generate formatted voter details for sharing
 */
export function formatVoterDetailsForShare(voter: VoterResult): string {
  return `
🗳️ Voter Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Serial No: ${voter.sr_no}
Name: ${voter.name}
Voter ID: ${voter.voter_id}
Contact: ${voter.mobile}
Address: ${voter.address}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Share voter details via WhatsApp
 */
export function shareViaWhatsApp(voter: VoterResult): void {
  const message = encodeURIComponent(formatVoterDetailsForShare(voter));
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Share voter details via direct contact (SMS/Message)
 */
export function shareViaContact(voter: VoterResult): void {
  const message = formatVoterDetailsForShare(voter);
  const contactUrl = `sms:?body=${encodeURIComponent(message)}`;
  window.location.href = contactUrl;
}

/**
 * Copy voter details to clipboard
 */
export async function copyToClipboard(voter: VoterResult): Promise<boolean> {
  try {
    const text = formatVoterDetailsForShare(voter);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("[v0] Error copying to clipboard:", error);
    return false;
  }
}

/**
 * Download voter slip as text file
 */
export function downloadVoterSlip(voter: VoterResult): void {
  const content = formatVoterDetailsForShare(voter);
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
  );
  element.setAttribute('download', `voter-slip-${voter.sr_no}.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Generate HTML for printing
 */
export function generatePrintHTML(voter: VoterResult): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Voter Slip - ${voter.sr_no}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #1e3a5f;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .serial {
      color: #666;
      font-size: 12px;
      margin-bottom: 10px;
    }
    h1 {
      color: #1e3a5f;
      margin: 0;
      font-size: 28px;
    }
    .voter-id {
      color: #666;
      font-size: 14px;
      margin-top: 8px;
    }
    .details {
      display: grid;
      gap: 20px;
    }
    .detail-item {
      border-left: 3px solid #d4a574;
      padding-left: 16px;
    }
    .label {
      color: #999;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .value {
      color: #1e3a5f;
      font-size: 16px;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="serial">Serial #${voter.sr_no}</div>
      <h1>${voter.name}</h1>
      <div class="voter-id">${voter.voter_id}</div>
    </div>
    
    <div class="details">
      <div class="detail-item">
        <div class="label">Contact Number</div>
        <div class="value">${voter.mobile}</div>
      </div>
      
      <div class="detail-item">
        <div class="label">Address</div>
        <div class="value">${voter.address}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>This is an official voter slip record. Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Print voter slip
 */
export function printVoterSlip(voter: VoterResult): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(generatePrintHTML(voter));
    printWindow.document.close();
    printWindow.print();
  }
}
