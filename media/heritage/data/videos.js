// ЗДЕСЬ ДОБАВЛЯЙ СВОИ ВИДЕО
// vkEmbed: ссылка из VK → Поделиться → Код для сайта → скопируй src="ВСТАВЬ СЮДА"
// thumbnail: путь к обложке в папке thumbnails (если нет — оставь null)
// duration: длительность видео, например "12:34"

const videos = [

    // ── ЕВРЕИ ИЗМЕНИВШИЕ МИР ──────────────────────────────────
    {
        id: 1,
        title: "Марк Бернес",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239044&autoplay=1",
        thumbnail: "thumbnails/mark-bernes.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 2,
        title: "Андрей Миронов",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239045&autoplay=1",
        thumbnail: "thumbnails/andrey-mironov.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 3,
        title: "Борис Пастернак",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239050&autoplay=1",
        thumbnail: "thumbnails/boris-pasternak.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 4,
        title: "Лев Ландау",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239053&autoplay=1",
        thumbnail: "thumbnails/lev-landau.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 5,
        title: "Фаина Раневская",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239059&autoplay=1",
        thumbnail: "thumbnails/faina-ranevskaya.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 6,
        title: "Аркадий Райкин",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239097&autoplay=1",
        thumbnail: "thumbnails/arkadiy-raykin.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 7,
        title: "Юрий Левитан",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/video_ext.php?oid=-211817327&id=456239081&hash=71e4bdd1bef1ef21&hd=4",
        thumbnail: "thumbnails/yuriy-levitan.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 8,
        title: "Леонид Утёсов",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239057&autoplay=1",
        thumbnail: "thumbnails/leonid-utesov.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 9,
        title: "Самуил Маршак",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239105&autoplay=1",
        thumbnail: "thumbnails/samuil-marshak.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 10,
        title: "Лев Зильбер",
        category: "evrei",
        season: null,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239102&autoplay=1",
        thumbnail: "thumbnails/lev-zilber.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 11,
        title: "Иосиф Кобзон",
        category: "evrei",
        season: null,
        vkEmbed: "https://vk.com/video_ext.php?oid=-211817327&id=456239110&autoplay=1",
        thumbnail: "thumbnails/iosif-kobzon.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 22,
        title: "Семен Лавочкин",
        category: "evrei",
        season: null,
        vkEmbed: "https://vk.com/clip_ext.php?oid=-211817327&id=456239117&autoplay=1",
        thumbnail: "thumbnails/lavochkin.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 23,
        title: "Семен Ария",
        category: "evrei",
        season: null,
        vkEmbed: "https://vk.com/clip_ext.php?oid=-211817327&id=456239120&autoplay=1",
        thumbnail: "thumbnails/ariya.jpg",
        duration: "00:00",
        description: ""
    },

    // ── ИСТОРИИ, КОТОРЫЕ ИЗМЕНИЛИ МИР — СЕЗОН 1. МОИСЕЙ ─────
    {
        id: 12,
        title: "1 серия. Начало",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239063&autoplay=1",
        thumbnail: "thumbnails/s1e01.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 13,
        title: "2 серия. Рождение",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239065&autoplay=1",
        thumbnail: "thumbnails/s1e02.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 14,
        title: "3 серия. Моисей",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239066&autoplay=1",
        thumbnail: "thumbnails/s1e03.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 15,
        title: "4 серия. Выбор",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239067&autoplay=1",
        thumbnail: "thumbnails/s1e04.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 16,
        title: "5 серия. Побег",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239068&autoplay=1",
        thumbnail: "thumbnails/s1e05.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 17,
        title: "6 серия. Казнь",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239070&autoplay=1",
        thumbnail: "thumbnails/s1e06.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 18,
        title: "7 серия. Возвращение",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239073&autoplay=1",
        thumbnail: "thumbnails/s1e07.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 19,
        title: "8 серия. Казни",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239079&autoplay=1",
        thumbnail: "thumbnails/s1e08.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 20,
        title: "9 серия. Казни",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vkvideo.ru/clip_ext.php?oid=-211817327&id=456239086&autoplay=1",
        thumbnail: "thumbnails/s1e09.jpg",
        duration: "00:00",
        description: ""
    },
    {
        id: 21,
        title: "10 серия. Исход",
        category: "istorii",
        season: 1,
        vkEmbed: "https://vk.com/clip_ext.php?oid=-211817327&id=456239113&autoplay=1",
        thumbnail: "thumbnails/s1e10.jpg",
        duration: "00:00",
        description: ""
    },

    // ── СИНАГОГИ МИРА ─────────────────────────────────────────
    // Раскомментируй и заполни когда будут видео:
    // {
    //     id: 22,
    //     title: "Название синагоги",
    //     category: "sinagogi",
    //     season: null,
    //     vkEmbed: "ССЫЛКА_ИЗ_VK",
    //     thumbnail: "thumbnails/ОБЛОЖКА.jpg",
    //     duration: "00:00",
    //     description: ""
    // },

    // Чтобы добавить новое видео — скопируй блок выше и измени данные.
    // Для нового сезона измени season: на нужный номер (например season: 2).
];
