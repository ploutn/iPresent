import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Keyboard,
  Volume2,
  Contrast,
  MousePointer,
  RefreshCw,
} from "lucide-react";
import { A11yTesting, announceToScreenReader } from "../../utils/accessibility";
import { cn } from "../../lib/utils";

interface AccessibilityIssue {
  type: "error" | "warning" | "info";
  category: "images" | "headings" | "keyboard" | "color" | "focus" | "aria";
  message: string;
  element?: string;
  suggestion?: string;
}

interface AccessibilityTestResult {
  category: string;
  icon: React.ReactNode;
  issues: AccessibilityIssue[];
  passed: number;
  total: number;
}

export function AccessibilityTester() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<AccessibilityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);

  // Run accessibility tests
  const runTests = async () => {
    setIsRunning(true);
    announceToScreenReader("Running accessibility tests");

    try {
      // Simulate test delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results: AccessibilityTestResult[] = [];

      // Test images
      const imageIssues = A11yTesting.checkImages();
      const totalImages = document.querySelectorAll("img").length;
      results.push({
        category: "Images & Media",
        icon: <Eye className="h-4 w-4" />,
        issues: imageIssues.map((issue) => ({
          type: "error" as const,
          category: "images" as const,
          message: issue,
          suggestion:
            'Add descriptive alt text or aria-hidden="true" for decorative images',
        })),
        passed: totalImages - imageIssues.length,
        total: totalImages,
      });

      // Test headings
      const headingIssues = A11yTesting.checkHeadings();
      const totalHeadings = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      ).length;
      results.push({
        category: "Heading Structure",
        icon: <Volume2 className="h-4 w-4" />,
        issues: headingIssues.map((issue) => ({
          type: "warning" as const,
          category: "headings" as const,
          message: issue,
          suggestion: "Ensure proper heading hierarchy (h1 → h2 → h3, etc.)",
        })),
        passed: Math.max(0, totalHeadings - headingIssues.length),
        total: totalHeadings,
      });

      // Test keyboard accessibility
      const keyboardIssues = A11yTesting.checkKeyboardAccess();
      const totalInteractive = document.querySelectorAll(
        "button, a, input, select, textarea, [tabindex]"
      ).length;
      results.push({
        category: "Keyboard Navigation",
        icon: <Keyboard className="h-4 w-4" />,
        issues: keyboardIssues.map((issue) => ({
          type: "error" as const,
          category: "keyboard" as const,
          message: issue,
          suggestion: "Ensure all interactive elements are keyboard accessible",
        })),
        passed: Math.max(0, totalInteractive - keyboardIssues.length),
        total: totalInteractive,
      });

      // Test ARIA attributes
      const ariaIssues = checkAriaAttributes();
      const totalAriaElements = document.querySelectorAll(
        "[role], [aria-label], [aria-labelledby]"
      ).length;
      results.push({
        category: "ARIA Attributes",
        icon: <Volume2 className="h-4 w-4" />,
        issues: ariaIssues,
        passed: Math.max(0, totalAriaElements - ariaIssues.length),
        total: Math.max(totalAriaElements, 1),
      });

      // Test focus indicators
      const focusIssues = checkFocusIndicators();
      results.push({
        category: "Focus Indicators",
        icon: <MousePointer className="h-4 w-4" />,
        issues: focusIssues,
        passed: Math.max(0, totalInteractive - focusIssues.length),
        total: totalInteractive,
      });

      // Test color contrast (basic check)
      const contrastIssues = checkColorContrast();
      results.push({
        category: "Color Contrast",
        icon: <Contrast className="h-4 w-4" />,
        issues: contrastIssues,
        passed: contrastIssues.length === 0 ? 1 : 0,
        total: 1,
      });

      setTestResults(results);
      setLastRunTime(new Date());

      const totalIssues = results.reduce(
        (sum, result) => sum + result.issues.length,
        0
      );
      announceToScreenReader(
        `Accessibility tests completed. Found ${totalIssues} issues across ${results.length} categories.`
      );
    } catch (error) {
      console.error("Error running accessibility tests:", error);
      announceToScreenReader("Error running accessibility tests");
    } finally {
      setIsRunning(false);
    }
  };

  // Additional test functions
  const checkAriaAttributes = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index) => {
      const hasAccessibleName =
        button.textContent?.trim() ||
        button.getAttribute("aria-label") ||
        button.getAttribute("aria-labelledby");
      if (!hasAccessibleName) {
        issues.push({
          type: "error",
          category: "aria",
          message: `Button ${index + 1} lacks accessible name`,
          suggestion: "Add aria-label or visible text content",
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach((input, index) => {
      const hasLabel =
        input.getAttribute("aria-label") ||
        input.getAttribute("aria-labelledby") ||
        document.querySelector(`label[for="${input.id}"]`);
      if (!hasLabel && input.getAttribute("type") !== "hidden") {
        issues.push({
          type: "error",
          category: "aria",
          message: `Form input ${index + 1} lacks proper label`,
          suggestion: "Add associated label or aria-label",
        });
      }
    });

    return issues;
  };

  const checkFocusIndicators = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Check if focus indicators are disabled globally
    const styles = getComputedStyle(document.documentElement);
    const outlineStyle = styles.getPropertyValue("outline");

    if (outlineStyle === "none" || outlineStyle === "0") {
      issues.push({
        type: "warning",
        category: "focus",
        message: "Global focus indicators may be disabled",
        suggestion: "Ensure custom focus indicators are implemented",
      });
    }

    return issues;
  };

  const checkColorContrast = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Basic check for potential contrast issues
    const textElements = document.querySelectorAll(
      "p, span, div, h1, h2, h3, h4, h5, h6"
    );
    let lowContrastCount = 0;

    textElements.forEach((element) => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Simple heuristic: if both color and background are very similar
      if (
        color === backgroundColor ||
        (color.includes("rgb(128") && backgroundColor.includes("rgb(128"))
      ) {
        lowContrastCount++;
      }
    });

    if (lowContrastCount > 0) {
      issues.push({
        type: "warning",
        category: "color",
        message: `${lowContrastCount} elements may have low color contrast`,
        suggestion:
          "Verify color contrast meets WCAG AA standards (4.5:1 for normal text)",
      });
    }

    return issues;
  };

  // Calculate overall score
  const calculateScore = () => {
    if (testResults.length === 0) return 0;

    const totalPassed = testResults.reduce(
      (sum, result) => sum + result.passed,
      0
    );
    const totalTests = testResults.reduce(
      (sum, result) => sum + result.total,
      0
    );

    return totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  };

  const score = calculateScore();
  const totalIssues = testResults.reduce(
    (sum, result) => sum + result.issues.length,
    0
  );

  // Auto-run tests when component becomes visible
  useEffect(() => {
    if (isVisible && testResults.length === 0) {
      runTests();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        aria-label="Open accessibility tester"
      >
        <Eye className="h-4 w-4 mr-2" />
        A11y Test
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[80vh] z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibility Tester
            </CardTitle>
            <CardDescription>WCAG 2.1 compliance checker</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            aria-label="Close accessibility tester"
          >
            ×
          </Button>
        </div>

        {/* Score and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                score >= 90
                  ? "default"
                  : score >= 70
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm"
            >
              {score}% Score
            </Badge>
            {totalIssues > 0 && (
              <Badge variant="outline" className="text-sm">
                {totalIssues} Issues
              </Badge>
            )}
          </div>
          <Button
            onClick={runTests}
            disabled={isRunning}
            size="sm"
            variant="outline"
            aria-label="Run accessibility tests"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-1", isRunning && "animate-spin")}
            />
            {isRunning ? "Testing..." : "Run Tests"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-4">
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Click "Run Tests" to check accessibility
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.icon}
                      <span className="font-medium text-sm">
                        {result.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {result.issues.length === 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {result.passed}/{result.total}
                      </span>
                    </div>
                  </div>

                  {result.issues.length > 0 && (
                    <div className="space-y-1 ml-6">
                      {result.issues.map((issue, issueIndex) => (
                        <Alert key={issueIndex} className="py-2">
                          <AlertTriangle className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            <div>{issue.message}</div>
                            {issue.suggestion && (
                              <div className="text-muted-foreground mt-1">
                                💡 {issue.suggestion}
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {index < testResults.length - 1 && <Separator />}
                </div>
              ))}

              {lastRunTime && (
                <div className="text-xs text-muted-foreground text-center pt-4">
                  Last run: {lastRunTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
