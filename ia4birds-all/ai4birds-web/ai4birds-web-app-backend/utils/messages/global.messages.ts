export default {
		// Error messages
		400: {
			BODY_CANNOT_BE_EMPTY: "Body cannot be empty.",
			PARAMS_CANNOT_BE_EMPTY: "Params cannot be empty.",
			QUERY_CANNOT_BE_EMPTY: "Query cannot be empty.",
			MISSING_PARAMETERS: `Missing parameters.`,
			ALREADY_EXISTS: `Already exists.`,
		},
		401: {
			NO_TOKEN_PROVIDED: "No token provided.",
			INVALID_TOKEN: "Invalid token.",
			UNAUTHORIZED: "Unauthorized.",
			INVALID_PWD: "Invalid password.",
		},
		403: {
			FORBIDDEN_DELETE: "Error on delete.",
			REQUIRE_ADMIN_ROLE: "Require Admin Role!",
			REQUIRE_USER_ROLE: "Require User Role!",
		},
		404: {
			NOT_FOUND: "Not found.",
		},
		409: {
			CONFLICT_UPDATE: "Error on update.",
			EMAIL_IN_USE: "Email already in use.",
			USERNAME_IN_USE: "Username already in use.",
		},
		500: {
			INTERNAL_SERVER_ERROR: `Internal server error.`,
			BYCRYPT_SALT_ERROR: `Bycrypt salt generation error.`,
			BYCRYPT_HASH_ERROR: `Bycrypt hash generation error.`,
			SMTP_VERIFY_ERROR: `SMTP server error.`,
			SMTP_SEND_ERROR: `SMTP server error while sending the email.`,
			USER_NOT_ACTIVATED: `User not activated.`,
		},
		// Success messages
		200: {
			SMTP_EMAIL_SENT: "Email succesfully sended!",
			USER_ACTIVATED: "User activated!",
			PASSWORD_CHANGED: "Password changed!",
			UPDATED_SUCCESSFULLY: "Updated successfully!",
			DELETED_SUCCESSFULLY: "Deleted successfully!",
			CV_UPLOADED_SUCCESSFULLY: "CV uploaded successfully!",
		},
		201: {
			CREATED_SUCCESSFULLY: "Created successfully!",
		},
		204: {
			NO_CONTENT: "No content.",
		},
	};
