import React from 'react'
import './SkinMenuButton.css'

type Props = {
    active: boolean,
    label: string,
    cb: () => void
}

export default function SkinMenuButton({ active, label, cb }: Props) {
    const className = active  ? 'skin-menu-button skinm-active' : 'skin-menu-button';
    return (
        <button className={className} onClick={cb}>
            {label}
        </button>
    )
}
