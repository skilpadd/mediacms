function initSlugGenerator(titleFieldId, slugFieldId) {
    const titleInput = document.querySelector(titleFieldId);
    const slugInput = document.querySelector(slugFieldId);

    if (!titleInput || !slugInput) {
        return;
    }

    let slugManuallyEdited = false;

    if (slugInput.value.trim() !== '') {
        slugManuallyEdited = true;
    }

    slugInput.addEventListener('input', () => {
        slugManuallyEdited = true;
    })

    titleInput.addEventListener('input', () => {
        if (slugManuallyEdited) {
            return;
        }

        const slug = titleInput.value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

        slugInput.value = slug;
    });
}