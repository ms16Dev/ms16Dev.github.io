import ResumeSection from './ResumeSection';

const CertificationsSection = ({ certifications }) => {
    if (!certifications?.length) return null;

    return (
        <ResumeSection title="Certifications">
            {certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                    <h3 className="font-bold text-slate-900">
                        {cert.title}
                    </h3>

                    <p className="text-sm text-slate-700">
                        {cert.issuer} • {cert.date}
                    </p>

                    {cert.url && (
                        <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline print:text-blue-900"
                        >
                            Verify Certificate
                        </a>
                    )}
                </div>
            ))}
        </ResumeSection>
    );
};

export default CertificationsSection;
