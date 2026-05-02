<script lang="ts">
    /* ─ No logic yet — static markup mapped from plans/contact.html ─ */
</script>

<div class="mx-auto px-6 py-20 pb-32 max-w-2xl">
    <h1
        class="font-display font-light text-text-secondary tracking-tight"
        data-od-id="headline"
    >
        Contact
    </h1>
    <p
        class="mt-3 mb-10 max-w-[480px] font-sans text-text-primary text-base"
        data-od-id="subhead"
    >
        Have a project in mind or just want to say hello? Drop a note and we’ll
        get back to you.
    </p>

    <div
        class="bg-gradient-to-b from-white/8 to-white/1 p-1 rounded-lg"
        data-od-id="form-card"
    >
        <div
            class="bg-surface-card shadow-surface p-8 md:p-10 rounded-md"
        >
            <form action="#" method="post" class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label
                        for="name"
                        class="font-medium text-text-primary text-xs uppercase tracking-widest"
                        >Name</label
                    >
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        class="bg-white/3 px-4 py-3.5 border border-white/8 focus:border-primary rounded-sm focus:outline-none w-full font-sans text-text-secondary placeholder:text-text-primary/25 text-base transition-colors duration-200"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label
                        for="email"
                        class="font-medium text-text-primary text-xs uppercase tracking-widest"
                        >Email</label
                    >
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        class="bg-white/3 px-4 py-3.5 border border-white/8 focus:border-primary rounded-sm focus:outline-none w-full font-sans text-text-secondary placeholder:text-text-primary/25 text-base transition-colors duration-200"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label
                        for="message"
                        class="font-medium text-text-primary text-xs uppercase tracking-widest"
                        >Message</label
                    >
                    <textarea
                        id="message"
                        name="message"
                        placeholder="What’s on your mind?"
                        required
                        rows="6"
                        class="bg-white/3 px-4 py-3.5 border border-white/8 focus:border-primary rounded-sm focus:outline-none w-full min-h-[160px] font-sans text-text-secondary placeholder:text-text-primary/25 text-base leading-relaxed transition-colors duration-200 resize-y"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    class="inline-flex items-center gap-2 btn-fill-primary px-7 py-3.5 border border-white/15 rounded-sm font-medium text-text-secondary hover:text-background text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer btn btn-primary btn-fill"
                >
                    Send message
                </button>
            </form>
        </div>
    </div>
</div>
