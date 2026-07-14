module.exports = {
  apps: [
    {
      name: "airavata-whatsapp-api",
      script: "./artifacts/api-server/dist/index.mjs",
      cwd: "/var/www/Airavata-Whatsapp-V1",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: "3014",

        // ── MongoDB ───────────────────────────────────────────────────────────
        MONGODB_URI: "mongodb+srv://raneaniket23_db_user:oqScJ68o1JPmvNto@airavata-whatsapp-solut.e3dj81w.mongodb.net/?appName=Airavata-Whatsapp-Solution",

        // ── Session ───────────────────────────────────────────────────────────
        SESSION_SECRET: "07O2oC0/xUfVvayY/JZuxiSxV78OiXyJUq6Jwi01lGW5qBSDuDPNYriUwnh5lV5qd4Pu21/C5CeHTjS3vxdt/Q==",

        // ── Meta / WhatsApp ───────────────────────────────────────────────────
        META_ACCESS_TOKEN: "EAAS0h8ZCJ7eIBR4YD38T6fISAoBuKIFZANh8GA8sufvf6R9HDtffNwbkPOzaLzfX2QFhiwqmK2PZBQ4hsRbNG4mLIZBzjCZB5wkFm0Br0epNdf6LqsdzfbftgFMD1P6SNl6TZCSf4hl6uZCU5O3ZAvMKk8OEaCYsd6yfJPMcyZCMotZA7Psqt2Er3F3luGCAu0z6niM88v2cUpLUZAEStL4e8JkaPAaIYo7XrJl8aZCf2eiU6Sv83CP60JAKhZCavZCBx6C5GxiiXvBIJwaqQKLDeZBSyv38UFWmnnsYUY3uu0rgwEZD",
        META_PHONE_NUMBER_ID: "1210872585439528",
        META_WABA_ID: "3126300490895014",
        WEBHOOK_VERIFY_TOKEN: "airavata_wh_2026",
      },
    },
  ],
};
