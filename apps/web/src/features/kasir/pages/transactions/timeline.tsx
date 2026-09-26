import {
  Timeline as MaterialTimeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@material-ui/lab";

const ACTIVE_COLOR = "#CF672E";
const INACTIVE_COLOR = "grey";

const CashierTransactionTimeline = ({ status }: { status: string }) => {
  const hasStarted = status === "proses" || status === "done";
  const isDone = status === "done";

  return (
    <MaterialTimeline align="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot style={{ backgroundColor: ACTIVE_COLOR }} />
          <TimelineConnector
            style={{
              backgroundColor: hasStarted ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}
          />
        </TimelineSeparator>
        <TimelineContent>Pending</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot
            style={{
              backgroundColor: hasStarted ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}
          />
          <TimelineConnector
            style={{ backgroundColor: isDone ? ACTIVE_COLOR : INACTIVE_COLOR }}
          />
        </TimelineSeparator>
        <TimelineContent>Proses</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot
            style={{ backgroundColor: isDone ? ACTIVE_COLOR : INACTIVE_COLOR }}
          />
        </TimelineSeparator>
        <TimelineContent>Done</TimelineContent>
      </TimelineItem>
    </MaterialTimeline>
  );
};

export default CashierTransactionTimeline;
