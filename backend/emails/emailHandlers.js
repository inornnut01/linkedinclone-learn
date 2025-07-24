import { mailtrapClient, sender } from "../lib/mailtrap.js";
import {
  createWelcomeEmailTemplate,
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipients = [
    {
      email,
    },
  ];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Welcome to UnLinked",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "Welcome Email",
    });

    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome Email", error);
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  email,
  name,
  commenterName,
  postUrl,
  comment
) => {
  const recipients = [
    {
      email,
    },
  ];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        name,
        commenterName,
        postUrl,
        comment
      ),
      category: "Comment Notification",
    });

    console.log("Comment Notification Email sent successfully", response);
  } catch (error) {
    console.error("Error sending comment notification email", error);
    throw error;
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  const recipients = [{ email: senderEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: "Connection Accepted",
    });

    console.log("Connection Accepted Email sent successfully", response);
  } catch (error) {
    console.error("Error in sendConnectionAcceptedEmail:", error);
  }
};
