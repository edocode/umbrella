import { test, expect } from '@playwright/test';

test('should display Create Game button', async ({ page }) => {
  await page.goto('http://localhost:8888')

  await expect(page.getByRole('button', { name: 'Create Game' })).toBeVisible()
})

test('should display name textbox in create game screen', async ({ page }) => {
  await page.goto('http://localhost:8888')

  await page.getByRole('button', { name: 'Create Game' }).click()

  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible()
})

test('should display player name in list after creating game', async ({ page }) => {
  await page.goto('http://localhost:8888')

  await page.getByRole('button', { name: 'Create Game' }).click()
  await page.getByRole('textbox', { name: 'Name' }).fill('Player 1')
  await page.getByRole('button', { name: 'Create Game' }).click()

  await expect(page.getByText('Player 1')).toBeVisible()
})

test('should display start game button', async ({ page }) => {
  await page.goto('http://localhost:8888')

  await page.getByRole('button', { name: 'Create Game' }).click()
  await page.getByRole('textbox', { name: 'Name' }).fill('Player 1')
  await page.getByRole('button', { name: 'Create Game' }).click()

  await expect(page.getByRole('button', { name: 'START GAME!' })).toBeVisible()
})

test('should display players in player list', async ({ browser }) => {
  const context = await browser.newContext()
  const page1 = await context.newPage()
  const page2 = await context.newPage()

  await page1.goto('http://localhost:8888')
  await page1.getByRole('button', { name: 'Create Game' }).click()
  await page1.getByRole('textbox', { name: 'Name' }).fill('Player 1')
  await page1.getByRole('button', { name: 'Create Game' }).click()

  await expect(page1.getByTestId('sessionId')).toBeVisible()
  const sessionId = await page1.getByTestId('sessionId').textContent()

  await page2.goto('http://localhost:8888')
  await page2.getByRole('button', { name: 'Join Game' }).click()
  await page2.getByRole('textbox', { name: 'Name' }).fill('Player 2')
  await page2.getByRole('textbox', { name: 'Game Id' }).fill(sessionId!.trim())
  await page2.getByRole('button', { name: 'Join Game' }).click()

  await expect(page1.getByText('Player 1')).toBeVisible()
  await expect(page1.getByText('Player 2')).toBeVisible()
  await expect(page2.getByText('Player 1')).toBeVisible()
  await expect(page2.getByText('Player 2')).toBeVisible()
})
