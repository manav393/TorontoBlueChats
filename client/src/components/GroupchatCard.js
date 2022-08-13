import Card from "react-bootstrap/Card";
import classes from "./GroupchatCard.module.css";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import ReportModal from "./ReportModal";
import copySvg from "../svgs/copy.svg";
import whatsappLogo from "../logos/WhatsApp_logo.webp";
import discordLogo from "../logos/discord-logo.png"
import messengerLogo from "../logos/messenger_logo.png"
import telegramLogo from '../logos/telegram_logo.webp'
import slackLogo from '../logos/Slack_logo.png'

const GroupchatCard = (props) => {
  const logos = {
    'WhatsApp': whatsappLogo,
    'Discord': discordLogo,
    'Telegram': telegramLogo,
    'Slack': slackLogo,
    'Facebook Messenger': messengerLogo
  }

  const [showReportModal, setShowReportModal] = useState(false);
  const { type, link, createdAt } = props.groupchat;
  const { handleReportAlert } = props;
  const date = new Date(createdAt)
    .toDateString()
    .split(" ")
    .slice(1)
    .toString()
    .replaceAll(",", " ");

  const handleReportShow = () => {
    setShowReportModal(true);
  };
  const handleReportClose = () => setShowReportModal(false);
  return (
    <>
      <Card className={`h-100 ${classes.square}`}>
        <Card.Header className="text-left text-primary-black fw-bold">
          {type}   <img
            alt=""
            src={logos[type]}
            width="20"
            height="20"
            className="d-inline-block align-top"
          />
        </Card.Header>
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Text className={classes.link}>
            <Card.Link href={link}>{link}</Card.Link>
          </Card.Text>
          <Card.Text className={classes.footer}>
            <small className="text-muted">Uploaded on {date} </small>
          </Card.Text>
        </Card.Body>
        <Card.Footer
          style={{ backgroundColor: "white" }}
          className="d-flex align-items-center justify-content-between"
        >
          <Button
            onClick={handleReportShow}
            className={`${classes.report} btn-sm `}
          >
            Report
          </Button>
          <div
            className="d-flex align-items-center"
            onClick={() => navigator.clipboard.writeText(link)}
            style={{
              cursor: "pointer",
            }}
          >
            <img src={copySvg} alt="copy" width="32" height="32" />
            <p className={`mb-0 ${classes.copy}`}>Copy</p>
          </div>
        </Card.Footer>
      </Card>
      <ReportModal
        handleReportFormClose={handleReportClose}
        showReportForm={showReportModal}
        groupChat={props.groupchat}
        handleReportAlert={handleReportAlert}
      ></ReportModal>
    </>
  );
};

export default GroupchatCard;
