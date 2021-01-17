import React from "react";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { useSelector } from "react-redux";
export default function CustomizedTimeline() {
  const transaction = useSelector((state) => state.Transactions.transaction);

  const colorActive = "#CF672E";

  return (
    <div>
      <Timeline align="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot style={{ backgroundColor: colorActive }} />
            <TimelineConnector
              style={{
                backgroundColor:
                  transaction["status"] === "proses" ||
                  transaction["status"] === "done"
                    ? colorActive
                    : "grey",
              }}
            />
          </TimelineSeparator>
          <TimelineContent>Pending</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              style={{
                backgroundColor:
                  transaction["status"] === "proses" ||
                  transaction["status"] === "done"
                    ? colorActive
                    : "grey",
              }}
            />
            <TimelineConnector
              style={{
                backgroundColor:
                  transaction["status"] === "done" ? colorActive : "grey",
              }}
            />
          </TimelineSeparator>
          <TimelineContent>Proses</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              style={{
                backgroundColor:
                  transaction["status"] === "done" ? colorActive : "grey",
              }}
            />
          </TimelineSeparator>
          <TimelineContent>Done</TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
