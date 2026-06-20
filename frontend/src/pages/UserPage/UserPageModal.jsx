import { useState, useEffect } from 'react';
import { Spinner, NumberField, DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { Mail } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDateTime } from "@internationalized/date";

export default function VetPageModal({ isOpen, onClose, tratActual, onSave, citas }) {
}