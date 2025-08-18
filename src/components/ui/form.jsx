import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = (
  {
    ...props
  }
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItemContext = React.createContext({})

function FormItem({
  className,
  ...props
}) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div 
        data-slot="form-item" 
        className={cn(
          // Ma (negative space) - generous spacing between form elements
          "grid gap-3 " +
          // Ensure proper spacing for form flow
          "mb-6 last:mb-0",
          className
        )} 
        {...props} 
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn(
        // Error state with subtle Japanese styling
        "data-[error=true]:text-destructive/80 " +
        // Smooth transitions
        "transition-colors duration-250 ease-gentle",
        className
      )}
      htmlFor={formItemId}
      {...props} />
  );
}

function FormControl({
  ...props
}) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props} />
  );
}

function FormDescription({
  className,
  ...props
}) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn(
        // Japanese typography principles
        "text-sm text-muted-foreground/80 leading-relaxed " +
        // Ma (negative space) - subtle spacing
        "mt-1 " +
        // Smooth transitions
        "transition-colors duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function FormMessage({
  className,
  ...props
}) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn(
        // Error styling with Japanese aesthetics
        "text-sm text-destructive/80 leading-relaxed " +
        // Ma (negative space) - subtle spacing
        "mt-1 " +
        // Smooth transitions
        "transition-colors duration-250 ease-gentle " +
        // Subtle styling for better UX
        "flex items-start gap-1.5 " +
        // Icon space for potential error icons
        "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:mt-0.5",
        className
      )}
      {...props}>
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
