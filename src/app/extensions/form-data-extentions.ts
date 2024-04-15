export function jsonToFormData(json: any): FormData {
    const formData = new FormData();

    // Duyệt qua các thuộc tính của đối tượng JSON
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const value = json[key];

            // Nếu giá trị là một đối tượng hoặc một mảng, chuyển đổi thành JSON và thêm vào FormData
            if (typeof value === 'object' && !Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    formData.append(`${key}[${i}]`, JSON.stringify(value[i]));
                }
            } else {
                // Nếu không, thêm giá trị vào FormData
                formData.append(key, value);
            }
        }
    }

    return formData;
}
