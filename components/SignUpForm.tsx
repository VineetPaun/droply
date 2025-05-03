"use client"
import { signInSchema } from "@/schemas/signinSchema"
import { signUpSchema } from "@/schemas/signupSchema"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const SignUpForm = () => {
    const router = useRouter()
    const [verifying, setVerifying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [authError, setAuthError] = useState<string | null>(null)
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const { signUp, isLoaded, setActive } = useSignUp()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) return
        setIsSubmitting(true)
        setAuthError(null)

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,

            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerifying(true)
        } catch (error: any) {
            console.error("SignUp error", error);
            setAuthError(
                error.errors?.[0]?.message || "An error occured during signup. Please try again"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleVarificationSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!isLoaded || !signUp) return
        setIsSubmitting(true)
        setAuthError(null)

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode
            })
            console.log(result);
            if(result.status === "complete") {
                await setActive({session: result.createdSessionId})
                router.push("/dashboard")
            } else {
                console.error("Verification incomplete", result);
                setVerificationError("Verificaion cound not be completed")
            }
            
        } catch (error: any) {
            console.log("Verification incomplete", error);
            setVerificationError(
                error.errors?.[0]?.message || "An error occured during signup. Please try again"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (verifying) {
        return (
            <h1>this is OTP entering field</h1>
        )
    }

    return (
        <div>
            <h1>Signup form with email and other fields</h1>
        </div>
    )
}

export default SignUpForm