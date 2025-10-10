import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { Box, Download } from "lucide-react";

 const OfferLetterPopup = ({ open, onClose, candidate }) => {
    if (!candidate) return null;

    const handleDownloadPDF = () => {
      window.print();
    };

    const formatIndianDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      
      const getOrdinal = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };

      return `${day}${getOrdinal(day)} ${month} ${year}`;
    };

    const getAcceptanceDeadline = (joiningDate) => {
      const date = new Date(joiningDate);
      date.setDate(date.getDate() - 1);
      return formatIndianDate(date);
    };

    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }} id="offer-letter-content">
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #e5e7eb', pb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                Tellapur Technology Private Limited
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                (An Initiative by My Home Group & Prathima)
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                Regd. Office: #1-123, 8° Floor, 3° Block, My Home Hub, Hi-tech City, Madhapur, Hyderabad - 500 081, Telangana, India.
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                CIN: U45400TG2007PTC053720 | Email ID: info@ttplhyd.com | Web: www.ttplhyd.com | Ph: 040-6639 8686
              </Typography>
            </Box>

            {/* Reference and Date */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                Ref No: TTPL/HR/F8/August - 01/2025-2026
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                {formatIndianDate(new Date())}
              </Typography>
            </Box>

            {/* Candidate Address */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {candidate.NAME}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151', whiteSpace: 'pre-line' }}>
                {candidate.ADDRESS}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                Phone No: {candidate.PHONE_NUMBER}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                E-mail: {candidate.EMAIL}
              </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ borderBottom: '1px solid #e5e7eb', mb: 3 }} />

            {/* Offer Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                textAlign: 'center', 
                mb: 3,
                color: '#1f2937'
              }}
            >
              Offer of Employment
            </Typography>

            {/* Salutation */}
            <Typography variant="body1" sx={{ mb: 2 }}>
              Dear <strong>Mr. {candidate.NAME},</strong>
            </Typography>

            {/* Main Content */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              This has reference to your application and subsequent interview you had with us, we are pleased to inform you that you have been selected for the position of <strong>"{candidate.DESIGNATION}"</strong> at our <strong>{candidate.PLANT}</strong>. Your CTC is as mutually agreed during final interview. Your appointment will be applicable subject to joining the duties on <strong>{formatIndianDate(candidate.joiningDate)}</strong>.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              Detailed appointment letter mentioning other terms and conditions of your employment will be issued upon joining with us.
            </Typography>

            {/* Documents List */}
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              You are requested to bring the following photocopies at the time of joining:
            </Typography>

            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Educational testimonials.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Experience certificates of the last 2 Companies.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Relieving letter from the last company & TDS Particulars.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>PAN, Aadhar and UAN Card (Color Photo Copies).</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Bank Statement for 2 months.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Passport size color photographs 8 Nos.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Latest Medical reports i.e. CBP & CJE, ABO Typing.</Typography>
            </Box>

            {/* Acceptance Deadline */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              We request you to send the signed copy of the offer as a token of your acceptance on or before <strong>{getAcceptanceDeadline(candidate.joiningDate)}</strong>.
            </Typography>

            {/* Signatures */}
            <Box sx={{ mt: 6 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  For Tellapur Technology Pvt. Ltd.
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Sudeep Kumar K</Typography>
                <Typography variant="body1">AVP - HR</Typography>
              </Box>

              <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 2, mt: 4 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  I have read this letter and understood the terms of employment. I accept the same without any reservations.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Date:</Typography>
                  <Typography variant="body2">Signature:</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={onClose} sx={{ color: '#6b7280' }}>
            Close
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            variant="contained"
            startIcon={<Download />}
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': {
                backgroundColor: '#2563eb'
              }
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export  default OfferLetterPopup;