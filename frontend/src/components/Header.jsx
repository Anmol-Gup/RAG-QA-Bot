import { FileText } from 'lucide-react';

const Header = () => {
    return (<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <FileText size={window.innerWidth < 480 ? 24 : window.innerWidth < 640 ? 28 : window.innerWidth < 1024 ? 32 : 36} style={{ color: '#4f46e5', marginRight: window.innerWidth < 640 ? '8px' : '12px' }} />
            <h1 style={{
                fontSize: window.innerWidth < 480 ? '1.5rem' : window.innerWidth < 640 ? '1.75rem' : window.innerWidth < 1024 ? '2rem' : '2.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0,
                lineHeight: '1.2'
            }}>Document QA Bot</h1>
        </div>
        <p style={{
            color: '#6b7280',
            fontSize: window.innerWidth < 480 ? '0.875rem' : window.innerWidth < 640 ? '0.95rem' : '1.125rem',
            margin: 0,
            padding: '0 1rem',
            lineHeight: '1.5'
        }}>Upload a PDF, CSV, or TXT file and ask questions about its content</p>
    </div>)
}

export default Header