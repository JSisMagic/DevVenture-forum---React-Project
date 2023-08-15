import {
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
} from "../common/constants";

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  const passwordRegex = new RegExp(
    `(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=\\-+]).{${PASSWORD_MIN_LENGTH},}`
  );
  return passwordRegex.test(password);
};

export const isValidFirstName = (firstname) => {
  return (
    firstname.length >= FIRST_NAME_MIN_LENGTH &&
    firstname.length <= FIRST_NAME_MAX_LENGTH
  );
};

export const isValidLastName = (lastname) => {
  return (
    lastname.length >= LAST_NAME_MIN_LENGTH &&
    lastname.length <= LAST_NAME_MAX_LENGTH
  );
};

export const isValidUsername = (username) => {
  return (
    username.length >= USERNAME_MIN_LENGTH &&
    username.length <= USERNAME_MAX_LENGTH
  );
};

export const isValidPostTitle = (title) => {
  return title.length >= TITLE_MIN_LENGTH && title.length <= TITLE_MAX_LENGTH;
};

export const isValidDescription = (description) => {
  return description.length >= DESCRIPTION_MIN_LENGTH && description.length <= DESCRIPTION_MAX_LENGTH;
}

export const isValidPostContent = (content) => {
  return content.length >= CONTENT_MIN_LENGTH && content.length <= CONTENT_MAX_LENGTH;
};

export const isValidTagInput = (input) => {
  const tagRegex = /^[^\s!@#$%^&*_=+\-].*$/;
  const tags = input.split(" ");
  
  for (const tag of tags) {
    if (!tagRegex.test(tag)) {
      return false;
    }
  }
  
  return true;
};