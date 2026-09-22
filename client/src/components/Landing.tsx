

const Landing = () => {

    return (
        <main className="landing-page min-h-[calc(100dvh-52px-140px)] grow flex flex-col items-center justify-start">
            <section className="w-full flex flex-col justify-start items-center gap-4 max-w-[1100px]">
                <h1 className="text-3xl md:text-4xl mt-16 font-semibold text-center text-(--accent-color)">Gain <span className="text-(--accent-light) italic">Fast</span> Insights on how <span className="text-(--accent-light)">Shariah Compliant</span> your Loans are</h1>

                <p className="text-xs md:text-sm text-center text-(--muted-foreground) max-w-2/3 md:max-w-1/2">
                     Sharah uses an fine-tuned AI pipeline to parse loan agreements clause-by-clause to detect hidden Riba, Gharar, and predatory compounding terms. 
                </p>
            </section>
        </main>

    )
}

export default Landing