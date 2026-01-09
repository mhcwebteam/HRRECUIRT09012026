import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CandidateApprovalFileModal = ({ open, onClose, fileUrl }) => {
  if (!fileUrl) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          backgroundColor: "#fff",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, height: "85vh" }}>
        <iframe
          src={fileUrl}
          title="Candidate Approval File"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CandidateApprovalFileModal;
