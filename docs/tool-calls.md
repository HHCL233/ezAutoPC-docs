# 工具调用

## 简介

工具调用可以向大模型提供**调用外部工具的能力**，以此实现 Agentic 的一些功能。

## 调用格式

在 ezAutoPC 中，支持使用2种调用格式：
- OpenAI ToolCalls
- 提示词

使用提示词格式时，ezAutoPC 不支持绝大部分功能。

> [!WARNING]
> 除非使用模型不支持 OpenAI ToolCalls ，否则应保持 OpenAI ToolCalls 调用格式不变。

> [!WARNING]
> 在下一个版本中，提示词调用格式将被移除。