# Scripts

This directory contains utility scripts for testing and development.

## Available Scripts

### 🧪 Testing Scripts

#### `quick-test.ps1`
Quick test script for basic functionality checks.

**Usage:**
```powershell
.\scripts\quick-test.ps1
```

**What it does:**
- Tests basic API endpoints
- Verifies database connectivity
- Checks authentication flow

---

#### `test-api.ps1`
Comprehensive API testing script.

**Usage:**
```powershell
.\scripts\test-api.ps1
```

**What it does:**
- Tests all API routes
- Validates request/response formats
- Checks error handling
- Tests authentication and authorization

---

#### `test-features.js`
Feature testing script for end-to-end functionality.

**Usage:**
```bash
node scripts/test-features.js
```

**What it does:**
- Tests chat functionality
- Validates report generation
- Checks dashboard features
- Tests user workflows

## Running Scripts

### Prerequisites

- Ensure the development server is running: `npm run dev`
- Database should be set up and seeded
- Ollama should be running with the required model

### PowerShell Scripts

For PowerShell scripts (`.ps1`), run from the project root:

```powershell
# Allow script execution (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run the script
.\scripts\script-name.ps1
```

### Node Scripts

For Node.js scripts (`.js`), run from the project root:

```bash
node scripts/script-name.js
```

## Adding New Scripts

When adding new scripts:

1. **Name clearly**: Use descriptive names (e.g., `test-auth.ps1`)
2. **Add documentation**: Update this README with script details
3. **Include comments**: Add inline comments explaining complex logic
4. **Handle errors**: Include proper error handling
5. **Make portable**: Use relative paths, not absolute paths

## Script Guidelines

### PowerShell Scripts

- Use `.ps1` extension
- Include error handling with `try/catch`
- Use `Write-Host` for output with colors
- Test on Windows PowerShell and PowerShell Core

### Node.js Scripts

- Use `.js` extension
- Include proper error handling
- Use `console.log` for output
- Keep dependencies minimal

## Common Issues

### PowerShell Execution Policy

If you get an execution policy error:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

If the dev server port is in use:

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Database Connection Issues

Ensure:
- PostgreSQL is running
- `.env` file has correct credentials
- Database exists and is migrated

## Testing Workflow

Recommended testing sequence:

1. **Start services**
   ```bash
   npm run dev
   ```

2. **Run quick test**
   ```powershell
   .\scripts\quick-test.ps1
   ```

3. **Run comprehensive tests**
   ```powershell
   .\scripts\test-api.ps1
   ```

4. **Test features**
   ```bash
   node scripts/test-features.js
   ```

5. **Manual testing**
   - Follow [Manual Testing Guide](../docs/testing/MANUAL_TESTING_GUIDE.md)

## Troubleshooting

### Script Fails to Run

1. Check prerequisites are met
2. Verify file paths are correct
3. Check script permissions
4. Review error messages carefully

### API Tests Fail

1. Ensure dev server is running
2. Check database is seeded
3. Verify Ollama is running
4. Check `.env` configuration

### Feature Tests Fail

1. Clear browser cache/cookies
2. Check for console errors
3. Verify all services are running
4. Review test logs

## Contributing

When contributing scripts:

- Follow existing patterns
- Add comprehensive documentation
- Test on multiple environments
- Update this README

## Support

For issues with scripts:
- Check the [Testing Guide](../docs/testing/TESTING_GUIDE.md)
- Review error messages
- Check GitHub issues
- Contact maintainers
