const { execSync } = require('child_process')

module.exports = async () => {
    execSync('docker compose up -d --wait', { stdio: 'inherit' })
    execSync('npx prisma db push', { stdio: 'inherit' })
}
