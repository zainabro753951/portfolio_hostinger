// src/hooks/useEmailTemplates.js

import { useState, useCallback, useMemo } from "react";
import {
  emailTemplates,
  templateCategories,
  getTemplateById,
  getTemplatesByCategory,
  processTemplate,
  generateDefaultVariables,
} from "../Utils/emailTemplates";

export const useEmailTemplates = (message = null) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyUsed, setRecentlyUsed] = useState(() => {
    // LocalStorage se recently used templates lao
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentTemplates");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    let templates = getTemplatesByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.content.toLowerCase().includes(query),
      );
    }

    return templates;
  }, [selectedCategory, searchQuery]);

  // Process template with variables
  const applyTemplate = useCallback(
    (templateId, customVariables = {}) => {
      const template = getTemplateById(templateId);
      if (!template) return null;

      const defaultVars = generateDefaultVariables(message);
      const variables = { ...defaultVars, ...customVariables };

      const processedContent = processTemplate(template, variables);

      // Recently used mein add karo
      setRecentlyUsed((prev) => {
        const newRecent = [
          templateId,
          ...prev.filter((id) => id !== templateId),
        ].slice(0, 5);
        localStorage.setItem("recentTemplates", JSON.stringify(newRecent));
        return newRecent;
      });

      return {
        ...template,
        processedContent,
        variables,
      };
    },
    [message],
  );

  // Get recently used templates
  const recentTemplates = useMemo(() => {
    return recentlyUsed.map((id) => getTemplateById(id)).filter(Boolean);
  }, [recentlyUsed]);

  // Preview template without applying
  const previewTemplate = useCallback(
    (templateId, customVariables = {}) => {
      const template = getTemplateById(templateId);
      if (!template) return null;

      const defaultVars = generateDefaultVariables(message);
      const variables = { ...defaultVars, ...customVariables };

      return processTemplate(template, variables);
    },
    [message],
  );

  // Create custom template
  const saveCustomTemplate = useCallback((templateData) => {
    const id = `custom-${Date.now()}`;
    const newTemplate = {
      ...templateData,
      id,
      category: "custom",
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    // LocalStorage mein save karo
    const saved = JSON.parse(localStorage.getItem("customTemplates") || "[]");
    localStorage.setItem(
      "customTemplates",
      JSON.stringify([...saved, newTemplate]),
    );

    return newTemplate;
  }, []);

  // Load custom templates
  const loadCustomTemplates = useCallback(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("customTemplates");
    return saved ? JSON.parse(saved) : [];
  }, []);

  // Delete custom template
  const deleteCustomTemplate = useCallback((templateId) => {
    const saved = JSON.parse(localStorage.getItem("customTemplates") || "[]");
    const filtered = saved.filter((t) => t.id !== templateId);
    localStorage.setItem("customTemplates", JSON.stringify(filtered));
  }, []);

  // Quick reply suggestions based on message content
  const getSuggestions = useCallback(() => {
    if (!message) return [];

    const suggestions = [];
    const msgText = message.message?.toLowerCase() || "";
    const subject = message.subject?.toLowerCase() || "";

    // Keywords check karo
    if (
      msgText.includes("price") ||
      msgText.includes("cost") ||
      subject.includes("pricing")
    ) {
      suggestions.push(emailTemplates.pricing);
    }
    if (msgText.includes("demo") || msgText.includes("trial")) {
      suggestions.push(emailTemplates.demo);
    }
    if (
      msgText.includes("urgent") ||
      msgText.includes("asap") ||
      msgText.includes("emergency")
    ) {
      suggestions.push(emailTemplates.urgent);
    }
    if (msgText.includes("thank") || msgText.includes("thanks")) {
      suggestions.push(emailTemplates.feedback);
    }

    return suggestions.slice(0, 3); // Max 3 suggestions
  }, [message]);

  return {
    // Data
    templates: filteredTemplates,
    categories: templateCategories,
    recentTemplates,
    suggestions: getSuggestions(),

    // State
    selectedCategory,
    searchQuery,

    // Actions
    setSelectedCategory,
    setSearchQuery,
    applyTemplate,
    previewTemplate,
    saveCustomTemplate,
    loadCustomTemplates,
    deleteCustomTemplate,
    getTemplateById,

    // Helpers
    processTemplate,
    generateDefaultVariables,
  };
};

// Hook for single template management
export const useTemplate = (templateId) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const template = useMemo(() => getTemplateById(templateId), [templateId]);

  const startEditing = useCallback(() => {
    if (template) {
      setEditedContent(template.content);
      setIsEditing(true);
    }
  }, [template]);

  const saveEdit = useCallback(() => {
    // Yahan aap backend pe save kar sakte hain ya localStorage mein
    setIsEditing(false);
    return editedContent;
  }, [editedContent]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedContent("");
  }, []);

  return {
    template,
    isEditing,
    editedContent,
    setEditedContent,
    startEditing,
    saveEdit,
    cancelEdit,
  };
};

export default useEmailTemplates;
