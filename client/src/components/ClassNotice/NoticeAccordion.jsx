import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Stack, TextField } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

export default function NoticeAccordion({ isTeacher, notices }) {
  return (
    <>
      {isTeacher && (
        <Accordion sx={{ mb: 10 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            ✍️ 공지사항을 입력하세요.
          </AccordionSummary>
          <AccordionDetails sx={{ whiteSpace: 'pre-line' }}>
            <TextField
              id="outlined-basic"
              label="제목을 입력하세요."
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              id="outlined-basic"
              label="내용을 입력하세요."
              variant="outlined"
              fullWidth
              multiline
              rows={8}
              sx={{ mb: 2 }}
              required
            />
            <Stack direction="row" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" type="reset">
                취소
              </Button>
              <Button variant="outlined">저장</Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
      {notices.map((notice, index) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {notice.title}
          </AccordionSummary>
          <AccordionDetails sx={{ whiteSpace: 'pre-line' }}>
            {notice.content}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
