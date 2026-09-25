# Email setup

DiagonalDebate uses SMTP for contact messages, feature suggestions, and legislation submissions. In production, configure all email variables listed in `.env.example`.

## Gmail setup

1. Enable two-factor authentication for the team Google account.
2. Create an app password at <https://myaccount.google.com/apppasswords>.
3. Put the app password in `SMTP_PASS`; never commit it.
4. Set `CONTACT_EMAIL` to the inbox that should receive contact messages.
5. Set `ADMIN_EMAILS` to the comma-separated addresses that should have admin access and receive legislation submissions.

For port `465`, the application enables implicit TLS. Other ports, including `587`, use STARTTLS when supported by the SMTP server.

## Verify

After deploying, submit one contact message and one test legislation item. Confirm that the team inbox, every intended admin, and the submitting user receive the expected mail.

If delivery fails, check the deployment logs and verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_EMAIL`, and `ADMIN_EMAILS` in the hosting provider. The API returns an error when email is unavailable; it does not claim that an undelivered message was queued.
