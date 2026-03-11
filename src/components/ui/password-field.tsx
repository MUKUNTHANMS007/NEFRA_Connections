"use client"

import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle, Copy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  showChecklist?: boolean
  allowGenerate?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PasswordField({
  label,
  placeholder = "Enter your password",
  className,
  showChecklist = true,
  allowGenerate = true,
  value,
  onChange,
  name,
  ...props
}: PasswordFieldProps) {
  const id = useId()
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const toggleVisibility = () => setIsVisible((prev) => !prev)

  // Password strength checks
  const checks = [
    { label: "At least 8 characters", valid: value.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(value) },
    { label: "One number", valid: /\d/.test(value) },
    { label: "One special character", valid: /[!@#$%^&*]/.test(value) },
  ]

  // Strength calculation
  const passed = checks.filter((c) => c.valid).length
  const strength =
    passed === 0 ? "Very Weak" : passed === 1 ? "Weak" : passed === 2 ? "Medium" : passed === 3 ? "Strong" : "Very Strong"
    
  const strengthColor =
    passed <= 1 ? "bg-red-500" : passed === 2 ? "bg-amber-500" : passed === 3 ? "bg-blue-500" : "bg-emerald-500"

  // Generate random secure password
  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
    let newPassword = ""
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }
    // Create a synthetic event to pass back to the parent form
    const syntheticEvent = {
      target: { value: newPassword, name: name || "password" }
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {label && <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 pr-24 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          {...props}
        />
        
        {/* Toggle visibility */}
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-10 flex items-center pr-2 text-slate-500 hover:text-blue-400 focus:outline-none transition-colors"
        >
          {isVisible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
        
        {/* Copy button */}
        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!value}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-emerald-400 focus:outline-none disabled:opacity-40 transition-colors"
        >
          <Copy size={16} />
        </button>
      </div>

      {/* Generate Button */}
      {allowGenerate && (
        <button
          type="button"
          onClick={generatePassword}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw size={14} /> Auto-Generate Secure Key
        </button>
      )}

      {/* Strength meter */}
      {value && showChecklist && (
        <div className="space-y-2 mt-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${strengthColor} shadow-[0_0_10px_currentColor]`}
              style={{ width: `${(passed / checks.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            Status: <span className={strengthColor.replace('bg-', 'text-')}>{strength}</span>
            {copied && <span className="text-emerald-400 ml-auto">✓ COPIED TO CLIPBOARD</span>}
          </p>
        </div>
      )}

      {/* Checklist */}
      {showChecklist && (
        <ul className="text-xs space-y-2 mt-3 p-4 rounded-xl bg-slate-950/40 border border-white/5">
          {checks.map((check, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 font-medium transition-colors duration-300",
                check.valid ? "text-emerald-400" : "text-slate-500"
              )}
            >
              {check.valid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {check.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}