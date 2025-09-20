// server/validators?js

import * as yup from 'yup';

import { fr } from 'yup-locales';
import { setLocale } from 'yup';
setLocale(fr);

export const userValidator = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
});

export const loginValidator = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});