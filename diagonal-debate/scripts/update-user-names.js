const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Helper function to capitalize name properly
function capitalizeName(name) {
  if (!name) return name
  
  const parts = name.trim().split(/\s+/)
  return parts.map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(' ')
}

async function updateUserNames() {
  try {
    console.log('Starting to update user names...')
    
    // Get all users with names
    const users = await prisma.user.findMany({
      where: {
        name: {
          not: null
        }
      }
    })
    
    console.log(`Found ${users.length} users with names`)
    
    let updatedCount = 0
    
    for (const user of users) {
      const originalName = user.name
      const capitalizedName = capitalizeName(originalName)
      
      // Only update if the name actually changed
      if (originalName !== capitalizedName) {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: capitalizedName }
        })
        
        console.log(`Updated: "${originalName}" → "${capitalizedName}"`)
        updatedCount++
      }
    }
    
    console.log(`\nUpdate complete! Updated ${updatedCount} out of ${users.length} user names.`)
    
  } catch (error) {
    console.error('Error updating user names:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the update
updateUserNames()
